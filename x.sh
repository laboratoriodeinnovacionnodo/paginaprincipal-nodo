#!/usr/bin/env bash
# =============================================================================
# 12_ciudadano-front_fix-noticia-slug.sh
#
# PROBLEMA:
#   app/noticias/[id]/page.tsx llama a /api/v1/noticias/:slug
#   pero el back espera un UUID en ese endpoint.
#   El endpoint público por slug es: GET /api/v1/noticias/slug/:slug
#
#   Además generateStaticParams usa NOTICIAS_API_URL que no está
#   disponible en build time → falla silenciosamente → Next genera
#   rutas vacías → 404 en producción.
#
# SOLUCIÓN:
#   - Endpoint correcto: /api/v1/noticias/slug/:slug
#   - Eliminar generateStaticParams (dynamic rendering, sin pre-render)
#   - dynamicParams = true para que Next acepte slugs no pre-renderizados
# =============================================================================
set -euo pipefail

echo "🔧 [ciudadano-front] Fix detalle noticia por slug..."

mkdir -p "app/noticias/[id]"

cat > "app/noticias/[id]/page.tsx" << 'ENDOFFILE'
/**
 * app/noticias/[id]/page.tsx
 * Detalle público de una noticia — renderizado dinámico en servidor.
 * Endpoint: GET /api/v1/noticias/slug/:slug   (público en noticias-back)
 */
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Tag as TagIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// dynamic = 'force-dynamic' → sin pre-render, siempre fresco
export const dynamic = "force-dynamic"

const API_URL = (
  process.env.NOTICIAS_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ""
).replace(/\/$/, "")

interface NoticiaTag {
  id:     string
  nombre: string
  slug:   string
}

interface Noticia {
  id:          string
  slug:        string
  titulo:      string
  resumen?:    string
  contenido:   string
  imagenUrl?:  string
  destacada:   boolean
  publicadaEn?: string
  categoria?:  { nombre: string; color?: string }
  tags:        NoticiaTag[]
}

async function getNoticia(slug: string): Promise<Noticia | null> {
  if (!API_URL) return null
  try {
    // ✅ Endpoint correcto: /slug/:slug  (no /:id que espera UUID)
    const res = await fetch(`${API_URL}/api/v1/noticias/slug/${slug}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = await res.json() as { data?: Noticia } & Noticia
    return (json.data ?? json) as Noticia
  } catch (err) {
    console.error("[noticia-detail] Error:", err)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id: slug } = await params
  const noticia = await getNoticia(slug)
  if (!noticia) return { title: "Noticia no encontrada | Nodo Tecnológico" }
  return {
    title:       `${noticia.titulo} | Nodo Tecnológico Catamarca`,
    description: noticia.resumen ?? noticia.titulo,
    openGraph: {
      title:       noticia.titulo,
      description: noticia.resumen ?? noticia.titulo,
      images:      noticia.imagenUrl ? [{ url: noticia.imagenUrl }] : [],
    },
  }
}

export default async function NoticiaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: slug } = await params
  const noticia = await getNoticia(slug)

  if (!noticia) notFound()

  const fecha = noticia.publicadaEn
    ? new Date(noticia.publicadaEn).toLocaleDateString("es-AR", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-blue-50">
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">

        {/* Volver */}
        <Link
          href="/noticias"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#26a7fc] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Volver a Noticias
        </Link>

        {/* Categoría */}
        {noticia.categoria && (
          <Badge
            className="mb-4 rounded-xl text-xs font-semibold"
            style={{
              backgroundColor: `${noticia.categoria.color ?? "#26a7fc"}20`,
              color:           noticia.categoria.color ?? "#26a7fc",
              borderColor:     `${noticia.categoria.color ?? "#26a7fc"}40`,
            }}
          >
            {noticia.categoria.nombre}
          </Badge>
        )}

        {/* Título */}
        <h1
          className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 text-balance leading-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {noticia.titulo}
        </h1>

        {/* Meta: fecha + tags */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-500">
          {fecha && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" strokeWidth={1.5} />
              <span>{fecha}</span>
            </div>
          )}
          {noticia.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4" strokeWidth={1.5} />
              <div className="flex flex-wrap gap-1.5">
                {noticia.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs rounded-lg">
                    {tag.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Imagen de portada */}
        {noticia.imagenUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-[#26a7fc]/10">
            <Image
              src={noticia.imagenUrl}
              alt={noticia.titulo}
              width={1200}
              height={600}
              className="w-full h-auto object-cover max-h-96"
              priority
            />
          </div>
        )}

        {/* Resumen destacado */}
        {noticia.resumen && (
          <p
            className="text-lg text-slate-600 leading-relaxed mb-8 font-medium
                       border-l-4 border-[#26a7fc]/40 pl-4 italic"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {noticia.resumen}
          </p>
        )}

        {/* Contenido */}
        <div
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="whitespace-pre-wrap text-base leading-7">
            {noticia.contenido}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-sm text-[#26a7fc] hover:text-[#1c8fe0] font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Ver todas las noticias
          </Link>
        </div>

      </main>
    </div>
  )
}
ENDOFFILE

echo "✅ app/noticias/[id]/page.tsx"
echo "   → endpoint: /api/v1/noticias/slug/:slug"
echo "   → dynamic: force-dynamic (sin pre-render)"

echo ""
echo "🔨 Verificando build..."
pnpm build

echo ""
echo "✅ Fix aplicado. /noticias/:slug ahora resuelve correctamente."