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
