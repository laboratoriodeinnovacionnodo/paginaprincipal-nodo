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
