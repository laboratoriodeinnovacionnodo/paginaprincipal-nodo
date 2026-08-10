#!/usr/bin/env bash
# =============================================================================
# 11_ciudadano-front_fix-noticias-undefined.sh
#
# ERRORES:
#   1. Cannot read properties of undefined (reading 'filter')
#      → noticias llega undefined al componente cliente
#      → el back puede devolver { data: { items } } o { items } o { data: [] }
#        el fetcher no cubría todos los casos
#
#   2. excited.png 404
#      → imagen referenciada en algún componente que no existe en /public
# =============================================================================
set -euo pipefail

echo "🔧 [ciudadano-front] Fix noticias undefined..."

# ─── 1. lib/noticias/api.ts — fetcher robusto con todos los shapes ────────────
cat > lib/noticias/api.ts << 'ENDOFFILE'
/**
 * lib/noticias/api.ts
 * Fetcher robusto que maneja todos los shapes de respuesta del back.
 */
import type { Noticia, NoticiasResponse } from './types'

const API_URL = (
  process.env.NOTICIAS_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ''
).replace(/\/$/, '')

const EMPTY: NoticiasResponse = { items: [], total: 0, page: 1, limit: 9, pages: 0 }

/** Extrae el array de items de cualquier shape que devuelva el back */
function extractItems(json: unknown): Noticia[] {
  if (!json || typeof json !== 'object') return []
  const j = json as Record<string, unknown>

  // { data: { items: [] } }
  if (j.data && typeof j.data === 'object') {
    const d = j.data as Record<string, unknown>
    if (Array.isArray(d.items)) return d.items as Noticia[]
    if (Array.isArray(d.data))  return d.data  as Noticia[]
    if (Array.isArray(d))       return d        as Noticia[]
  }

  // { items: [] }
  if (Array.isArray(j.items)) return j.items as Noticia[]

  // { data: [] }
  if (Array.isArray(j.data)) return j.data as Noticia[]

  // respuesta directa []
  if (Array.isArray(json)) return json as Noticia[]

  return []
}

function extractMeta(json: unknown, items: Noticia[]): Omit<NoticiasResponse, 'items'> {
  const j = (json && typeof json === 'object' ? json : {}) as Record<string, unknown>
  const d = (j.data && typeof j.data === 'object' ? j.data : j) as Record<string, unknown>
  return {
    total: Number(d.total ?? items.length),
    page:  Number(d.page  ?? 1),
    limit: Number(d.limit ?? 9),
    pages: Number(d.pages ?? Math.ceil(items.length / 9)),
  }
}

export async function getNoticias(
  params: { page?: number; limit?: number; search?: string; categoriaId?: string; tagId?: string } = {},
): Promise<NoticiasResponse> {
  if (!API_URL) {
    console.warn('[noticias-api] NOTICIAS_API_URL no definida')
    return EMPTY
  }

  try {
    const qs = new URLSearchParams()
    qs.set('estado', 'PUBLICADA')
    qs.set('page',   String(params.page  ?? 1))
    qs.set('limit',  String(params.limit ?? 9))
    if (params.search)      qs.set('search',      params.search)
    if (params.categoriaId) qs.set('categoriaId', params.categoriaId)
    if (params.tagId)       qs.set('tagId',       params.tagId)

    const res = await fetch(`${API_URL}/api/v1/noticias?${qs}`, { cache: 'no-store' })

    if (!res.ok) {
      console.error(`[noticias-api] GET /noticias → ${res.status}`)
      return EMPTY
    }

    const json: unknown = await res.json()
    const items = extractItems(json)
    const meta  = extractMeta(json, items)
    return { items, ...meta }
  } catch (err) {
    console.error('[noticias-api] Error:', err)
    return EMPTY
  }
}

export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  if (!API_URL) return null
  try {
    const res = await fetch(`${API_URL}/api/v1/noticias/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json() as { data?: Noticia } & Noticia
    return (json.data ?? json) as Noticia
  } catch {
    return null
  }
}
ENDOFFILE
echo "✅ lib/noticias/api.ts (robusto)"

# ─── 2. components/noticias/noticias-content.tsx — defensivo en props ─────────
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
  noticias?: Noticia[] | null   // defensivo: acepta undefined/null
}

export function NoticiasContent({ noticias: raw }: NoticiasContentProps) {
  // garantiza array aunque llegue undefined/null
  const noticias: Noticia[] = Array.isArray(raw) ? raw : []

  const {
    tagsSeleccionados, busqueda, paginaActual,
    toggleTag, setBusqueda, setPaginaActual, limpiarFiltros,
  } = useNoticiasFilter()

  const noticiasFiltradas = filterNoticias(noticias, tagsSeleccionados, busqueda)

  const itemsPorPagina  = 6
  const totalPaginas    = Math.ceil(noticiasFiltradas.length / itemsPorPagina)
  const indiceInicio    = (paginaActual - 1) * itemsPorPagina
  const noticiasPaginadas = noticiasFiltradas.slice(indiceInicio, indiceInicio + itemsPorPagina)

  const tagsDisponibles = Array.from(
    new Set(noticias.flatMap((n) => n.tags?.map((t) => t.nombre) ?? []))
  ).sort()

  const formatFecha = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", {
      day: "numeric", month: "long", year: "numeric",
    })

  return (
    <>
      {/* Buscador + tags */}
      <section className="pb-4">
        <div className="container mx-auto px-4 flex flex-col gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar noticias..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1) }}
              className="pl-9 bg-white/70 backdrop-blur-sm rounded-xl border-[#26a7fc]/20 focus:border-[#26a7fc] focus:ring-[#26a7fc]/20"
            />
          </div>

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
      </section>

      {/* Grid */}
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
                    {/* Imagen */}
                    {noticia.imagenUrl ? (
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={noticia.imagenUrl}
                          alt={noticia.titulo}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
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
                            className="text-xs rounded-lg font-medium"
                            style={{
                              backgroundColor: `${noticia.categoria.color ?? '#26a7fc'}20`,
                              color:           noticia.categoria.color ?? '#26a7fc',
                              borderColor:     `${noticia.categoria.color ?? '#26a7fc'}40`,
                            }}
                          >
                            {noticia.categoria.nombre}
                          </Badge>
                        )}
                        {(noticia.tags ?? []).slice(0, 2).map((tag) => (
                          <Badge key={tag.id} variant="secondary" className="text-xs">
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
ENDOFFILE
echo "✅ noticias-content.tsx (defensivo)"

# ─── 3. next.config — permitir dominios de imágenes del back ──────────────────
# El back sirve imágenes desde S3/storage — next/image necesita los dominios
CONFIG="next.config.mjs"
if [ ! -f "$CONFIG" ]; then CONFIG="next.config.js"; fi

if [ -f "$CONFIG" ] && ! grep -q "remotePatterns\|images:" "$CONFIG"; then
  echo ""
  echo "⚠️  Agregar remotePatterns a $CONFIG para que next/image funcione:"
  echo ""
  echo "   images: {"
  echo "     remotePatterns: ["
  echo "       { protocol: 'https', hostname: '**' },"
  echo "     ],"
  echo "   },"
fi

echo ""
echo "🔨 Verificando build..."
pnpm build

echo ""
echo "✅ Fix aplicado."