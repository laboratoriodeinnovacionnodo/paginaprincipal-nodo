#!/usr/bin/env bash
# ============================================================
# fix-noticias-runtime-env.sh — v1.0.0
# Problema: NOTICIAS_API_URL solo existe en build-time pero
# Next.js la necesita en runtime (SSR fetch en page.tsx).
# Solución: pasar la variable al runner del Dockerfile
# Y agregarla al .env del contenedor en el deploy.
#
# Toca:
#   1. Dockerfile      → ENV NOTICIAS_API_URL en runner stage
#   2. deploy.yml      → agregar al .env del contenedor
#   3. app/noticias/page.tsx → limit 100 para traer todas
#   4. hooks + filters + noticias-content (filtros cascada)
# ============================================================
set -euo pipefail

BOLD="\033[1m"; RESET="\033[0m"; GREEN="\033[32m"; RED="\033[31m"; YELLOW="\033[33m"
log()  { echo -e "${BOLD}${GREEN}[OK]${RESET} $*"; }
warn() { echo -e "${BOLD}${YELLOW}[→]${RESET}  $*"; }
err()  { echo -e "${BOLD}${RED}[ERR]${RESET} $*"; exit 1; }

[[ -f "package.json" ]] || err "Corré desde la raíz del repo ciudadano-front"
[[ -f "Dockerfile" ]]   || err "No se encontró Dockerfile"

# ─── 1. Dockerfile — agregar NOTICIAS_API_URL al stage runner ────────────────
warn "Parcheando Dockerfile para pasar NOTICIAS_API_URL al runner..."

# El runner stage (Stage 3) no tiene la variable. La agregamos como ARG + ENV
# para que Next.js pueda leerla en runtime cuando Node ejecuta server.js.
node - << 'NODEEOF'
const fs = require('fs')
let src = fs.readFileSync('Dockerfile', 'utf8')

// Agregar ARG y ENV justo antes del CMD en el runner stage
// Buscamos la línea "ENV PORT=3000" y agregamos NOTICIAS_API_URL antes
if (src.includes('ENV NOTICIAS_API_URL')) {
  console.log('Dockerfile ya tiene NOTICIAS_API_URL — sin cambios')
  process.exit(0)
}

// Agrega ARG para recibir el build-arg y ENV para exponerlo en runtime
src = src.replace(
  'ENV NEXT_TELEMETRY_DISABLED=1',
  'ENV NEXT_TELEMETRY_DISABLED=1\nARG NOTICIAS_API_URL\nENV NOTICIAS_API_URL=$NOTICIAS_API_URL'
)

fs.writeFileSync('Dockerfile', src, 'utf8')
console.log('Dockerfile actualizado ✓')
NODEEOF

log "Dockerfile ✓"

# ─── 2. deploy.yml — agregar NOTICIAS_API_URL al .env del contenedor ─────────
warn "Parcheando .github/workflows/deploy.yml..."

node - << 'NODEEOF'
const fs   = require('fs')
const path = '.github/workflows/deploy.yml'
let src = fs.readFileSync(path, 'utf8')

// En el script de deploy, el .env del contenedor se escribe con printf.
// Agregamos NOTICIAS_API_URL si no está ya.
if (src.includes('"NOTICIAS_API_URL=${NOTICIAS_API_URL}"')) {
  console.log('deploy.yml ya tiene NOTICIAS_API_URL en el .env del contenedor — sin cambios')
  process.exit(0)
}

// Busca el bloque printf que escribe /etc/ciudadano-front/.env
// y agrega NOTICIAS_API_URL
src = src.replace(
  `"NOTICIAS_API_URL=${NOTICIAS_API_URL}" \\\n              > /etc/ciudadano-front/.env`,
  // ya está — noop
  `"NOTICIAS_API_URL=${NOTICIAS_API_URL}" \\\n              > /etc/ciudadano-front/.env`
)

// Si el printf no incluye NOTICIAS_API_URL como línea del archivo .env, lo agregamos
// Buscamos el patrón del printf y añadimos la variable
src = src.replace(
  /"NEXT_GROQ_MODEL=\$\{NEXT_GROQ_MODEL\}" \\\n\s+> \/etc\/ciudadano-front\/\.env/,
  `"NEXT_GROQ_MODEL=\${NEXT_GROQ_MODEL}" \\\n              "NOTICIAS_API_URL=\${NOTICIAS_API_URL}" \\\n              > /etc/ciudadano-front/.env`
)

fs.writeFileSync(path, src, 'utf8')
console.log('deploy.yml actualizado ✓')
NODEEOF

log "deploy.yml ✓"

# ─── 3. app/noticias/page.tsx — limit 100 ────────────────────────────────────
warn "Actualizando app/noticias/page.tsx ..."

cat > app/noticias/page.tsx << 'TSX'
import type { Metadata } from "next"
import { CodeTitle } from "@/components/shared/code-title"
import { NoticiasContent } from "@/components/noticias/noticias-content"
import { getNoticias } from "@/lib/noticias/api"

export const metadata: Metadata = {
  title: "Noticias | Nodo Tecnológico Catamarca",
  description: "Las últimas novedades del Nodo Tecnológico de Catamarca.",
}

export default async function NoticiasPage() {
  // Traemos hasta 100 noticias para que los filtros client-side
  // operen sobre el conjunto completo publicado.
  const { items: noticias } = await getNoticias({ limit: 100 })

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <main>
        <section className="relative overflow-hidden pt-24 pb-4">
          <div className="container mx-auto px-4 text-center">
            <CodeTitle as="h1" className="mb-6 text-4xl font-bold text-balance md:text-6xl">
              Las Novedades del{" "}
              <span className="text-[#26a7fc]">Nodo</span>
            </CodeTitle>
          </div>
        </section>

        <NoticiasContent noticias={noticias} />
      </main>
    </div>
  )
}
TSX
log "app/noticias/page.tsx ✓"

# ─── 4. hooks/noticias/use-noticias-filter.ts ────────────────────────────────
warn "Actualizando hooks/noticias/use-noticias-filter.ts ..."
mkdir -p hooks/noticias

cat > hooks/noticias/use-noticias-filter.ts << 'TS'
"use client"

import { useState } from "react"

export const useNoticiasFilter = () => {
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todas")
  const [tagsSeleccionados, setTagsSeleccionados] = useState<string[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)

  const setCategoria = (slug: string) => {
    setCategoriaActiva(slug)
    setTagsSeleccionados([])
    setPaginaActual(1)
  }

  const toggleTag = (tag: string) => {
    setTagsSeleccionados((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
    setPaginaActual(1)
  }

  const limpiarFiltros = () => {
    setCategoriaActiva("todas")
    setTagsSeleccionados([])
    setBusqueda("")
    setPaginaActual(1)
  }

  return {
    categoriaActiva, tagsSeleccionados, busqueda, paginaActual,
    setCategoria, toggleTag, setBusqueda, setPaginaActual, limpiarFiltros,
  }
}
TS
log "use-noticias-filter.ts ✓"

# ─── 5. lib/noticias/filters.ts ──────────────────────────────────────────────
warn "Actualizando lib/noticias/filters.ts ..."
mkdir -p lib/noticias

cat > lib/noticias/filters.ts << 'TS'
import type { Noticia } from './types'

export function filterNoticias(
  noticias: Noticia[],
  categoriaActiva: string,
  tags: string[],
  busqueda: string,
): Noticia[] {
  return noticias.filter((n) => {
    const matchCategoria =
      categoriaActiva === "todas" ||
      n.categoria?.slug === categoriaActiva

    const matchTags =
      tags.length === 0 ||
      n.tags.some((t) => tags.includes(t.nombre))

    const q = busqueda.toLowerCase()
    const matchBusqueda =
      busqueda === '' ||
      n.titulo.toLowerCase().includes(q) ||
      (n.resumen ?? '').toLowerCase().includes(q) ||
      n.categoria?.nombre.toLowerCase().includes(q) ||
      n.tags.some((t) => t.nombre.toLowerCase().includes(q))

    return matchCategoria && matchTags && matchBusqueda
  })
}

export function getTagsParaCategoria(
  noticias: Noticia[],
  categoriaActiva: string,
): string[] {
  const base = categoriaActiva === "todas"
    ? noticias
    : noticias.filter((n) => n.categoria?.slug === categoriaActiva)

  return Array.from(
    new Set(base.flatMap((n) => n.tags?.map((t) => t.nombre) ?? []))
  ).sort()
}

export function getCategoriaColor(color?: string): string {
  return color ?? '#26a7fc'
}
TS
log "filters.ts ✓"

# ─── 6. components/noticias/noticias-content.tsx ─────────────────────────────
warn "Actualizando components/noticias/noticias-content.tsx ..."
mkdir -p components/noticias

cat > components/noticias/noticias-content.tsx << 'TSX'
"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge }  from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input }  from "@/components/ui/input"
import { Calendar, Search, ArrowRight, ImageOff, X } from "lucide-react"
import { filterNoticias, getTagsParaCategoria } from "@/lib/noticias/filters"
import { useNoticiasFilter } from "@/hooks/noticias/use-noticias-filter"
import { Paginacion } from "@/components/shared/paginacion"
import type { Noticia, NoticiaCategoria } from "@/lib/noticias/types"

interface NoticiasContentProps {
  noticias?: Noticia[] | null
}

export function NoticiasContent({ noticias: raw }: NoticiasContentProps) {
  const noticias: Noticia[] = Array.isArray(raw) ? raw : []

  const {
    categoriaActiva, tagsSeleccionados, busqueda, paginaActual,
    setCategoria, toggleTag, setBusqueda, setPaginaActual, limpiarFiltros,
  } = useNoticiasFilter()

  // Categorías únicas de las noticias recibidas
  const categorias: NoticiaCategoria[] = Array.from(
    new Map(
      noticias
        .filter((n) => n.categoria)
        .map((n) => [n.categoria.id, n.categoria])
    ).values()
  ).sort((a, b) => a.nombre.localeCompare(b.nombre))

  const tagsDisponibles = getTagsParaCategoria(noticias, categoriaActiva)

  const noticiasFiltradas = filterNoticias(
    noticias, categoriaActiva, tagsSeleccionados, busqueda
  )

  const itemsPorPagina    = 6
  const totalPaginas      = Math.ceil(noticiasFiltradas.length / itemsPorPagina)
  const indiceInicio      = (paginaActual - 1) * itemsPorPagina
  const noticiasPaginadas = noticiasFiltradas.slice(indiceInicio, indiceInicio + itemsPorPagina)

  const hayFiltrosActivos =
    categoriaActiva !== "todas" ||
    tagsSeleccionados.length > 0 ||
    busqueda !== ""

  const formatFecha = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", {
      day: "numeric", month: "long", year: "numeric",
    })

  return (
    <>
      <section className="pb-6">
        <div className="container mx-auto px-4 flex flex-col gap-5">

          {/* Buscador */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar noticias..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1) }}
              className="pl-9 bg-white/70 backdrop-blur-sm rounded-xl border-[#26a7fc]/20 focus:border-[#26a7fc] focus:ring-[#26a7fc]/20"
            />
          </div>

          {/* Filtro categoría */}
          {categorias.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Categoría</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoria("todas")}
                  className={[
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors border",
                    categoriaActiva === "todas"
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white/70 text-slate-600 border-slate-200 hover:border-slate-400",
                  ].join(" ")}
                >
                  Todas
                </button>

                {categorias.map((cat) => {
                  const color  = cat.color ?? "#26a7fc"
                  const active = categoriaActiva === cat.slug
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoria(cat.slug)}
                      style={active
                        ? { backgroundColor: color, borderColor: color, color: "#fff" }
                        : { borderColor: `${color}40`, color }
                      }
                      className={[
                        "rounded-full px-4 py-1.5 text-sm font-medium transition-colors border",
                        active ? "shadow-sm" : "bg-white/70 hover:opacity-80",
                      ].join(" ")}
                    >
                      {cat.nombre}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Filtro tags */}
          {tagsDisponibles.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tags
                {categoriaActiva !== "todas" && (
                  <span className="ml-1 font-normal normal-case text-slate-400">— dentro de la categoría</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {tagsDisponibles.map((tag) => (
                  <Badge
                    key={tag}
                    variant={tagsSeleccionados.includes(tag) ? "default" : "outline"}
                    className={[
                      "cursor-pointer transition-colors text-xs select-none",
                      tagsSeleccionados.includes(tag)
                        ? "bg-[#26a7fc] hover:bg-[#1c8fe0] border-transparent text-white"
                        : "bg-white/70 backdrop-blur-sm hover:bg-[#26a7fc]/10 border-[#26a7fc]/20",
                    ].join(" ")}
                    onClick={() => { toggleTag(tag); setPaginaActual(1) }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Limpiar */}
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#26a7fc] w-fit underline underline-offset-2"
            >
              <X className="h-3 w-3" />
              Limpiar filtros
            </button>
          )}
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-6">
            {noticiasFiltradas.length}{" "}
            {noticiasFiltradas.length === 1 ? "noticia encontrada" : "noticias encontradas"}
          </p>

          {noticias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl mb-4">📰</span>
              <h2 className="text-xl font-semibold text-slate-700 mb-2">Próximamente habrá novedades</h2>
              <p className="text-sm text-muted-foreground max-w-xs">Estamos preparando el contenido. ¡Volvé pronto!</p>
            </div>
          ) : noticiasFiltradas.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No se encontraron noticias con los filtros seleccionados.</p>
              <button onClick={limpiarFiltros} className="mt-3 text-sm text-[#26a7fc] hover:underline">
                Ver todas las noticias
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {noticiasPaginadas.map((noticia) => (
                  <Card
                    key={noticia.id}
                    className="flex flex-col transition-shadow hover:shadow-lg bg-white/70 backdrop-blur-sm overflow-hidden"
                  >
                    {noticia.imagenUrl ? (
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={noticia.imagenUrl}
                          alt={noticia.titulo}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                        />
                      </div>
                    ) : (
                      <div className="h-44 w-full bg-gradient-to-br from-[#26a7fc]/10 to-cyan-50 flex items-center justify-center">
                        <ImageOff className="h-8 w-8 text-[#26a7fc]/30" strokeWidth={1.5} />
                      </div>
                    )}

                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {noticia.categoria && (
                          <Badge
                            className="text-xs rounded-lg font-medium cursor-pointer"
                            style={{
                              backgroundColor: `${noticia.categoria.color ?? "#26a7fc"}20`,
                              color:           noticia.categoria.color ?? "#26a7fc",
                              borderColor:     `${noticia.categoria.color ?? "#26a7fc"}40`,
                            }}
                            onClick={() => setCategoria(noticia.categoria.slug)}
                          >
                            {noticia.categoria.nombre}
                          </Badge>
                        )}
                        {(noticia.tags ?? []).slice(0, 2).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-[#26a7fc]/10"
                            onClick={() => { toggleTag(tag.nombre); setPaginaActual(1) }}
                          >
                            {tag.nombre}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-base leading-snug line-clamp-2">{noticia.titulo}</CardTitle>
                      {noticia.resumen && (
                        <CardDescription className="leading-relaxed line-clamp-2 text-xs mt-1">
                          {noticia.resumen}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="flex-1 pb-2">
                      {noticia.publicadaEn && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
                          <span>{formatFecha(noticia.publicadaEn)}</span>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter>
                      <Button
                        asChild variant="ghost" size="sm"
                        className="gap-1 text-[#26a7fc] hover:text-[#1c8fe0] hover:bg-[#26a7fc]/10 rounded-xl px-3 -ml-3"
                      >
                        <Link href={`/noticias/${noticia.slug}`}>
                          Leer más <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="mt-10">
                  <Paginacion
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onPaginaChange={setPaginaActual}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
TSX
log "noticias-content.tsx ✓"

echo ""
echo -e "${BOLD}${GREEN}================================================${RESET}"
echo -e "${BOLD}${GREEN}  Fix completo aplicado ✅                      ${RESET}"
echo -e "${BOLD}${GREEN}================================================${RESET}"
echo ""
echo "  Causa raíz encontrada:"
echo "  NOTICIAS_API_URL se inyectaba solo en build-time pero"
echo "  Next.js la necesita en runtime para los fetches SSR."
echo ""
echo "  Correcciones:"
echo "  • Dockerfile         → ARG+ENV NOTICIAS_API_URL en el runner stage"
echo "  • deploy.yml         → NOTICIAS_API_URL en el .env del contenedor"
echo "  • app/noticias/page  → limit 100"
echo "  • hooks/filters/UI   → filtros cascada categoría + tags"
echo ""