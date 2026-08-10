#!/usr/bin/env bash
# =============================================================================
# 10_ciudadano-front_noticias-reales.sh
#
# Conecta /noticias de ciudadano-front con el noticias-back real.
#
# ESTADO ACTUAL:
#   - app/noticias/page.tsx → <NoticiasContent noticias={[]} /> (vacío)
#   - lib/noticias/types.ts → tipo viejo (id: number, fecha, autor)
#   - No hay fetcher real
#
# SOLUCIÓN:
#   1. lib/noticias/api.ts         → fetcher server-side hacia noticias-back
#   2. lib/noticias/types.ts       → tipo actualizado al shape real del back
#   3. lib/noticias/filters.ts     → adaptar filter a los nuevos campos
#   4. app/noticias/page.tsx       → Server Component que fetcha y pasa datos
#   5. components/noticias/noticias-content.tsx → card adaptada al tipo real
# =============================================================================
set -euo pipefail

echo "🚀 [ciudadano-front] Conectando noticias reales del back..."

mkdir -p lib/noticias components/noticias

# ─── 1. lib/noticias/types.ts — tipo real del back ────────────────────────────
echo "📌 lib/noticias/types.ts"
cat > lib/noticias/types.ts << 'ENDOFFILE'
/**
 * lib/noticias/types.ts
 * Espeja el shape real que devuelve noticias-back (Prisma).
 */

export interface NoticiaTag {
  id:     string
  nombre: string
  slug:   string
}

export interface NoticiaCategoria {
  id:     string
  nombre: string
  slug:   string
  color?: string
}

export interface Noticia {
  id:           string
  titulo:       string
  slug:         string
  resumen?:     string
  contenido:    string
  imagenUrl?:   string
  destacada:    boolean
  publicadaEn?: string
  creadaEn:     string
  categoria:    NoticiaCategoria
  tags:         NoticiaTag[]
}

export interface NoticiasResponse {
  items: Noticia[]
  total: number
  page:  number
  limit: number
  pages: number
}
ENDOFFILE
echo "✅ types.ts"

# ─── 2. lib/noticias/api.ts — fetcher server-side ────────────────────────────
echo "📌 lib/noticias/api.ts"
cat > lib/noticias/api.ts << 'ENDOFFILE'
/**
 * lib/noticias/api.ts
 * Fetcher server-side para noticias-back.
 * Usa NOTICIAS_API_URL (variable de servidor, red_interna Docker).
 */
import type { Noticia, NoticiasResponse } from './types'

const API_URL = (
  process.env.NOTICIAS_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ''
).replace(/\/$/, '')

interface FetchNoticiasParams {
  page?:       number
  limit?:      number
  search?:     string
  categoriaId?: string
  tagId?:      string
}

export async function getNoticias(
  params: FetchNoticiasParams = {},
): Promise<NoticiasResponse> {
  const EMPTY: NoticiasResponse = { items: [], total: 0, page: 1, limit: 9, pages: 0 }

  if (!API_URL) {
    console.warn('[noticias-api] NOTICIAS_API_URL no definida')
    return EMPTY
  }

  try {
    const qs = new URLSearchParams()
    qs.set('estado', 'PUBLICADA')                          // solo publicadas
    qs.set('page',   String(params.page  ?? 1))
    qs.set('limit',  String(params.limit ?? 9))
    if (params.search)      qs.set('search',      params.search)
    if (params.categoriaId) qs.set('categoriaId', params.categoriaId)
    if (params.tagId)       qs.set('tagId',       params.tagId)

    const res = await fetch(`${API_URL}/api/v1/noticias?${qs}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error(`[noticias-api] GET /noticias → ${res.status}`)
      return EMPTY
    }

    const json = await res.json() as { data?: NoticiasResponse } & NoticiasResponse
    const data = (json.data ?? json) as NoticiasResponse
    return data
  } catch (err) {
    console.error('[noticias-api] Error:', err)
    return EMPTY
  }
}

export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  if (!API_URL) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/noticias/${slug}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = await res.json() as { data?: Noticia } & Noticia
    return (json.data ?? json) as Noticia
  } catch {
    return null
  }
}
ENDOFFILE
echo "✅ api.ts"

# ─── 3. lib/noticias/filters.ts — adaptar al tipo real ───────────────────────
echo "📌 lib/noticias/filters.ts"
cat > lib/noticias/filters.ts << 'ENDOFFILE'
import type { Noticia } from './types'

export function filterNoticias(
  noticias: Noticia[],
  tags: string[],
  busqueda: string,
): Noticia[] {
  return noticias.filter((n) => {
    const matchTags =
      tags.length === 0 ||
      n.tags.some((t) => tags.includes(t.nombre))

    const q = busqueda.toLowerCase()
    const matchBusqueda =
      busqueda === '' ||
      n.titulo.toLowerCase().includes(q) ||
      (n.resumen ?? '').toLowerCase().includes(q) ||
      n.tags.some((t) => t.nombre.toLowerCase().includes(q))

    return matchTags && matchBusqueda
  })
}

export function getCategoriaColor(color?: string): string {
  if (color) return color
  return '#26a7fc'
}
ENDOFFILE
echo "✅ filters.ts"

# ─── 4. app/noticias/page.tsx — Server Component con fetch real ───────────────
echo "📌 app/noticias/page.tsx"
mkdir -p app/noticias
cat > app/noticias/page.tsx << 'ENDOFFILE'
import type { Metadata } from "next"
import { CodeTitle } from "@/components/shared/code-title"
import { NoticiasContent } from "@/components/noticias/noticias-content"
import { getNoticias } from "@/lib/noticias/api"

export const metadata: Metadata = {
  title: "Noticias | Nodo Tecnológico Catamarca",
  description: "Las últimas novedades del Nodo Tecnológico de Catamarca.",
}

export default async function NoticiasPage() {
  const { items: noticias } = await getNoticias({ limit: 9 })

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
ENDOFFILE
echo "✅ app/noticias/page.tsx"

# ─── 5. components/noticias/noticias-content.tsx — cards con tipo real ────────
echo "📌 components/noticias/noticias-content.tsx"
mkdir -p components/noticias
cat > components/noticias/noticias-content.tsx << 'ENDOFFILE'
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
import { Calendar, Search, ArrowRight, ImageOff } from "lucide-react"
import { filterNoticias } from "@/lib/noticias/filters"
import { useNoticiasFilter } from "@/hooks/noticias/use-noticias-filter"
import { Paginacion } from "@/components/shared/paginacion"
import type { Noticia } from "@/lib/noticias/types"

interface NoticiasContentProps {
  noticias: Noticia[]
}

export function NoticiasContent({ noticias }: NoticiasContentProps) {
  const {
    tagsSeleccionados,
    busqueda,
    paginaActual,
    toggleTag,
    setBusqueda,
    setPaginaActual,
    limpiarFiltros,
  } = useNoticiasFilter()

  const noticiasFiltradas = filterNoticias(noticias, tagsSeleccionados, busqueda)

  const itemsPorPagina = 6
  const totalPaginas   = Math.ceil(noticiasFiltradas.length / itemsPorPagina)
  const indiceInicio   = (paginaActual - 1) * itemsPorPagina
  const noticiasPaginadas = noticiasFiltradas.slice(indiceInicio, indiceInicio + itemsPorPagina)

  // Tags únicos extraídos de todas las noticias
  const tagsDisponibles = Array.from(
    new Set(noticias.flatMap((n) => n.tags.map((t) => t.nombre)))
  ).sort()

  const formatFecha = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", {
      day: "numeric", month: "long", year: "numeric",
    })

  return (
    <>
      {/* Buscador y filtros de tags */}
      <section className="pb-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">

            {/* Búsqueda */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar noticias..."
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1) }}
                className="pl-9 bg-white/70 backdrop-blur-sm rounded-xl border-[#26a7fc]/20
                           focus:border-[#26a7fc] focus:ring-[#26a7fc]/20"
              />
            </div>

            {/* Tags */}
            {tagsDisponibles.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                {tagsSeleccionados.length > 0 && (
                  <button
                    onClick={limpiarFiltros}
                    className="text-xs text-muted-foreground hover:text-[#26a7fc] underline underline-offset-2"
                  >
                    Limpiar filtros
                  </button>
                )}
                {tagsDisponibles.map((tag) => (
                  <Badge
                    key={tag}
                    variant={tagsSeleccionados.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors text-xs ${
                      tagsSeleccionados.includes(tag)
                        ? "bg-[#26a7fc] hover:bg-[#1c8fe0] border-transparent text-white"
                        : "bg-white/70 backdrop-blur-sm hover:bg-[#26a7fc]/10 border-[#26a7fc]/20"
                    }`}
                    onClick={() => { toggleTag(tag); setPaginaActual(1) }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Grid de noticias */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-6">
            {noticiasFiltradas.length}{" "}
            {noticiasFiltradas.length === 1 ? "noticia encontrada" : "noticias encontradas"}
          </p>

          {noticias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl mb-4">📰</span>
              <h2 className="text-xl font-semibold text-slate-700 mb-2">
                Próximamente habrá novedades
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Estamos preparando el contenido. ¡Volvé pronto!
              </p>
            </div>
          ) : noticiasFiltradas.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">
                No se encontraron noticias con los filtros seleccionados.
              </p>
              <button
                onClick={limpiarFiltros}
                className="mt-3 text-sm text-[#26a7fc] hover:underline"
              >
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
                    {/* Imagen de portada */}
                    {noticia.imagenUrl ? (
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={noticia.imagenUrl}
                          alt={noticia.titulo}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="h-44 w-full bg-gradient-to-br from-[#26a7fc]/10 to-cyan-50
                                      flex items-center justify-center">
                        <ImageOff className="h-8 w-8 text-[#26a7fc]/30" strokeWidth={1.5} />
                      </div>
                    )}

                    <CardHeader className="pb-2">
                      {/* Categoría + Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge
                          className="text-xs rounded-lg font-medium"
                          style={{
                            backgroundColor: `${noticia.categoria?.color ?? '#26a7fc'}20`,
                            color:           noticia.categoria?.color ?? '#26a7fc',
                            borderColor:     `${noticia.categoria?.color ?? '#26a7fc'}40`,
                          }}
                        >
                          {noticia.categoria?.nombre}
                        </Badge>
                        {noticia.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag.id} variant="secondary" className="text-xs">
                            {tag.nombre}
                          </Badge>
                        ))}
                      </div>

                      <CardTitle className="text-balance text-base leading-snug line-clamp-2">
                        {noticia.titulo}
                      </CardTitle>

                      {noticia.resumen && (
                        <CardDescription className="text-pretty leading-relaxed line-clamp-2 text-xs mt-1">
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
                        asChild
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-[#26a7fc] hover:text-[#1c8fe0] hover:bg-[#26a7fc]/10 rounded-xl px-3 -ml-3"
                      >
                        <Link href={`/noticias/${noticia.slug}`}>
                          Leer más
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
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
ENDOFFILE
echo "✅ noticias-content.tsx"

# ─── 6. Build ─────────────────────────────────────────────────────────────────
echo ""
echo "🔨 Verificando build..."
pnpm build

echo ""
echo "✅ Noticias reales conectadas."
echo ""
echo "📋 Archivos creados/modificados:"
echo "   lib/noticias/types.ts                   ← tipo real del back"
echo "   lib/noticias/api.ts                     ← fetcher server-side"
echo "   lib/noticias/filters.ts                 ← adaptar al tipo real"
echo "   app/noticias/page.tsx                   ← Server Component con fetch"
echo "   components/noticias/noticias-content.tsx ← cards con imagen, categoría, tags"
echo ""
echo "📌 Solo se muestran noticias con estado=PUBLICADA"
echo "📌 NOTICIAS_API_URL debe estar en el .env del contenedor (ya configurado)"