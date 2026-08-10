"use client"

// app/cursos/page.tsx — Server Component

import { CodeTitle } from "@/components/shared/code-title"
import type { Metadata } from 'next'
import { getCursos } from '@/lib/cursos/api'
import type { CursoBack } from '@/lib/cursos/types'
import { CursoCardNodo } from '@/components/cursos/curso-card-nodo'

export const metadata: Metadata = {
  title: 'Cursos | Nodo Tecnológico Catamarca',
  description: 'Explorá la oferta de cursos gratuitos del Nodo Tecnológico de Catamarca.',
}

export default async function CursosPage() {
  let cursos: CursoBack[] = []
  let error = false
  try {
    const data = await getCursos({ limit: 100 })
    cursos = data.items.filter((c) => c.available).sort((a, b) => a.order - b.order)
  } catch { error = true }

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-blue-50">
      <section className="relative overflow-hidden pt-24 pb-10">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#26a7fc]">Formación gratuita</p>
          <CodeTitle as="h1" className="mb-4 text-4xl font-bold text-balance md:text-5xl">Nuestros <span className="text-[#26a7fc]">Cursos</span></CodeTitle>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground text-pretty leading-relaxed">
            Aprendé tecnología con el equipo del Nodo Tecnológico de Catamarca. Todos los cursos son gratuitos.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 pb-24">
        {error ? (
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
            <p className="mb-6 text-sm text-muted-foreground">{cursos.length} curso{cursos.length !== 1 ? 's' : ''} disponible{cursos.length !== 1 ? 's' : ''}</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cursos.map((curso) => <CursoCardNodo key={curso.id} curso={curso} />)}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
