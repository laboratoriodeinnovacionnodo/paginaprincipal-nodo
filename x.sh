#!/usr/bin/env bash
# =============================================================================
# 00_ciudadano-front_fix-build.sh
# Corrige 2 errores de build preexistentes en ciudadano-front:
#
#   ERROR 1 — app/cursos/page.tsx
#     "use client" + export metadata → no permitido en Next.js
#     Fix: separar en page.tsx (Server) + cursos-client.tsx (Client)
#
#   ERROR 2 — app/noticias/[id]/page.tsx
#     Importa @/lib/strapi/api que no existe
#     Fix: reemplazar por el cliente real del noticias-back
#
# Correr ANTES que 03_ciudadano-front_landing.sh
# =============================================================================
set -euo pipefail

echo "🔧 [ciudadano-front] Corrigiendo errores de build preexistentes..."

# ─── ERROR 1: app/cursos/page.tsx — "use client" + metadata ─────────────────
echo ""
echo "📌 Fix 1: app/cursos/page.tsx — separar Server/Client..."

# Backup
[ -f app/cursos/page.tsx ] && cp app/cursos/page.tsx app/cursos/page.tsx.bak

# Leer el archivo actual para extraer lo que necesitamos
# Creamos el Server Component (page.tsx) que solo exporta metadata
cat > app/cursos/page.tsx << 'ENDOFFILE'
import type { Metadata } from "next"
import { CursosClient } from "./cursos-client"

export const metadata: Metadata = {
  title: "Cursos | Nodo Tecnológico Catamarca",
  description: "Explorá la oferta de cursos gratuitos del Nodo Tecnológico de Catamarca.",
}

/**
 * Server Component — solo maneja metadata.
 * La lógica interactiva vive en CursosClient.
 */
export default function CursosPage() {
  return <CursosClient />
}
ENDOFFILE

# Crear el Client Component si no existe
# (movemos el contenido "use client" a cursos-client.tsx)
if [ ! -f app/cursos/cursos-client.tsx ]; then

cat > app/cursos/cursos-client.tsx << 'ENDOFFILE'
"use client"

import { useEffect, useState } from "react"
import { CursoCardNodo } from "@/components/cursos/curso-card-nodo"

const API_URL = process.env.NEXT_PUBLIC_CURSOS_API_URL ?? ""

interface Curso {
  id: string
  slug: string
  title: string
  description: string
  level: string
  duration: string
  emoji: string
  available: boolean
  [key: string]: unknown
}

export function CursosClient() {
  const [cursos, setCursos]   = useState<Curso[]>([])
  const [error, setError]     = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/cursos/public`, { cache: "no-store" })
        if (!res.ok) throw new Error("Error al cargar cursos")
        const json = await res.json() as { data?: Curso[]; items?: Curso[] } | Curso[]
        const list = Array.isArray(json)
          ? json
          : (json as { data?: Curso[]; items?: Curso[] }).data
          ?? (json as { data?: Curso[]; items?: Curso[] }).items
          ?? []
        setCursos(list)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchCursos()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-blue-50">
      <section className="container mx-auto px-4 pt-28 pb-8">
        <div className="text-center mb-10">
          <h1
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Todos los <span className="text-[#26a7fc]">Cursos</span>
          </h1>
          <p className="text-slate-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Todos los cursos son gratuitos.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-600">No pudimos cargar los cursos. Intentá de nuevo más tarde.</p>
          </div>
        ) : cursos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🎓</span>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Pronto habrá nuevos cursos</h2>
            <p className="text-sm text-muted-foreground max-w-xs">Estamos preparando la próxima oferta formativa.</p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {cursos.length} curso{cursos.length !== 1 ? "s" : ""} disponible{cursos.length !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cursos.map((curso) => (
                <CursoCardNodo key={curso.id} curso={curso} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
ENDOFFILE

  echo "✅ app/cursos/cursos-client.tsx creado"
else
  echo "ℹ️  cursos-client.tsx ya existe, se respeta el contenido actual"
fi

echo "✅ Fix 1 aplicado"

# ─── ERROR 2: app/noticias/[id]/page.tsx — @/lib/strapi/api inexistente ──────
echo ""
echo "📌 Fix 2: app/noticias/[id]/page.tsx — reemplazar import de strapi..."

NOTICIA_PAGE="app/noticias/[id]/page.tsx"

if [ -f "$NOTICIA_PAGE" ]; then
  cp "$NOTICIA_PAGE" "${NOTICIA_PAGE}.bak"
  echo "📦 Backup en ${NOTICIA_PAGE}.bak"
fi

mkdir -p "app/noticias/[id]"

cat > "app/noticias/[id]/page.tsx" << 'ENDOFFILE'
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const API_URL = process.env.NOTICIAS_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? ""

interface Tag {
  id:     string
  nombre: string
  slug:   string
}

interface Noticia {
  id:         string
  slug:       string
  titulo:     string
  resumen?:   string
  contenido:  string
  imagenUrl?: string
  destacada:  boolean
  publicadaEn?: string
  categoria?: { nombre: string; color?: string }
  tags:       Tag[]
}

async function getNoticia(slug: string): Promise<Noticia | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/noticias/${slug}`, {
      next: { revalidate: 60 },
    })
    if (res.status === 404) return null
    if (!res.ok) return null
    const json = await res.json() as { data?: Noticia } & Noticia
    return (json.data ?? json) as Noticia
  } catch {
    return null
  }
}

async function getNoticias(): Promise<Noticia[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/noticias?limit=10`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const json = await res.json() as { data?: { items?: Noticia[] } } | { items?: Noticia[] }
    const payload = (json as { data?: { items?: Noticia[] } }).data ?? json as { items?: Noticia[] }
    return payload.items ?? []
  } catch {
    return []
  }
}

// Metadata dinámica
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const noticia = await getNoticia(id)
  if (!noticia) return { title: "Noticia no encontrada" }
  return {
    title:       `${noticia.titulo} | Nodo Tecnológico`,
    description: noticia.resumen ?? noticia.titulo,
  }
}

// Static params para pre-render
export async function generateStaticParams() {
  const noticias = await getNoticias()
  return noticias.map((n) => ({ id: n.slug }))
}

export default async function NoticiaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const noticia = await getNoticia(id)

  if (!noticia) notFound()

  const fecha = noticia.publicadaEn
    ? new Date(noticia.publicadaEn).toLocaleDateString("es-AR", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-blue-50">
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">

        {/* Volver */}
        <Link
          href="/noticias"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#26a7fc] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Volver a Noticias
        </Link>

        {/* Header */}
        <div className="mb-8">
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

          <h1
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 text-balance leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {noticia.titulo}
          </h1>

          {fecha && (
            <p className="text-sm text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
              {fecha}
            </p>
          )}

          {noticia.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {noticia.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="rounded-xl text-xs">
                  {tag.nombre}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Imagen */}
        {noticia.imagenUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-[#26a7fc]/10">
            <Image
              src={noticia.imagenUrl}
              alt={noticia.titulo}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Resumen */}
        {noticia.resumen && (
          <p
            className="text-lg text-slate-600 leading-relaxed mb-8 font-medium border-l-4 border-[#26a7fc]/30 pl-4"
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
          <div className="whitespace-pre-wrap">{noticia.contenido}</div>
        </div>

      </main>
    </div>
  )
}
ENDOFFILE

echo "✅ Fix 2 aplicado"

# ─── Build final ──────────────────────────────────────────────────────────────
echo ""
echo "🔨 Verificando build..."
pnpm build

echo ""
echo "✅ [ciudadano-front] Build exitoso. Podés correr ahora 03_ciudadano-front_landing.sh"