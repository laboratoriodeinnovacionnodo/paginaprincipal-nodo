#!/usr/bin/env bash
# =============================================================================
# x.sh — ciudadano-front · feat: cursos desde cursos-nodo-back
# Ejecutar desde la raíz del repo: bash x.sh
# =============================================================================
set -euo pipefail

# ── lib/cursos/types.ts ───────────────────────────────────────────────────────
mkdir -p lib/cursos
cat > lib/cursos/types.ts << 'EOF'
// lib/cursos/types.ts
// Tipos que devuelve cursos-nodo-back (GET /api/v1/courses)

export type CursoLevel = 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO'

export type AulaSlot =
  | 'AULA_1' | 'AULA_2' | 'AULA_3'
  | 'AULA_4' | 'AULA_5' | 'AULA_6'

export interface RegistroModuleResumen {
  id: string
  slug: string
  name: string
  active: boolean
  type: string
}

export interface ProfeResumen {
  id: string
  nombre: string
  email: string
}

export interface CursoBack {
  id: string
  slug: string
  title: string
  description: string
  level: CursoLevel
  duration: string
  modules: number
  steps: number
  emoji: string
  tags: string[]
  available: boolean
  current: boolean
  order: number
  whatsappLink: string | null
  maxParticipants: number | null
  waitlistEnabled: boolean
  aula: AulaSlot | null
  horaInicio: string | null
  horaFin: string | null
  fechaInicio: string | null
  fechaFin: string | null
  profeId: string | null
  profe: ProfeResumen | null
  createdAt: string
  updatedAt: string
  registroModules: RegistroModuleResumen[]
  _count: { preinscripciones: number; registroModules: number }
}

export interface CursosListResponse {
  items: CursoBack[]
  total: number
  page: number
  limit: number
  pages: number
}

/** Slug del RegistroModule PREINSCRIPCION activo, o null */
export function getRegistroSlug(curso: CursoBack): string | null {
  return curso.registroModules.find(
    (m) => m.active && m.type === 'PREINSCRIPCION',
  )?.slug ?? null
}

export const NIVEL_LABEL: Record<CursoLevel, string> = {
  PRINCIPIANTE: 'Principiante',
  INTERMEDIO:   'Intermedio',
  AVANZADO:     'Avanzado',
}

export const AULA_NOMBRE: Record<AulaSlot, string> = {
  AULA_1: 'Aula 1 — Planta baja',
  AULA_2: 'Aula 2 — Planta baja',
  AULA_3: 'Aula 3 — Primer piso',
  AULA_4: 'Aula 4 — Primer piso',
  AULA_5: 'Aula 5 — Segundo piso',
  AULA_6: 'Aula 6 — Segundo piso',
}
EOF

# ── lib/cursos/api.ts ─────────────────────────────────────────────────────────
cat > lib/cursos/api.ts << 'EOF'
// lib/cursos/api.ts
// Cliente público para cursos-nodo-back.
// GET /courses y GET /courses/by-slug/:slug son @Public() — sin API key.
// Variable: NEXT_PUBLIC_CURSOS_API_URL

import type { CursosListResponse, CursoBack } from './types'

const BASE = (process.env.NEXT_PUBLIC_CURSOS_API_URL ?? '').replace(/\/$/, '')

function url(path: string) {
  if (!BASE) throw new Error('[cursos-api] NEXT_PUBLIC_CURSOS_API_URL no configurada')
  return `${BASE}/api/v1${path}`
}

export async function getCursos(params?: {
  page?: number; limit?: number; search?: string
}): Promise<CursosListResponse> {
  const qs = new URLSearchParams()
  if (params?.page)   qs.set('page',   String(params.page))
  if (params?.limit)  qs.set('limit',  String(params.limit))
  if (params?.search) qs.set('search', params.search)
  const res = await fetch(url(`/courses${qs.size ? `?${qs}` : ''}`), {
    next: { revalidate: 60 },
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`[cursos-api] GET /courses → ${res.status}`)
  const json = await res.json()
  return (json?.data ?? json) as CursosListResponse
}

export async function getCursoBySlug(slug: string): Promise<CursoBack | null> {
  try {
    const res = await fetch(url(`/courses/by-slug/${slug}`), {
      next: { revalidate: 60 },
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`${res.status}`)
    const json = await res.json()
    return (json?.data ?? json) as CursoBack
  } catch { return null }
}
EOF

# ── app/cursos/page.tsx ───────────────────────────────────────────────────────
cat > app/cursos/page.tsx << 'EOF'
// app/cursos/page.tsx — Server Component
import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Clock, Users, MapPin, CalendarDays, ExternalLink, BookOpen } from 'lucide-react'
import { getCursos } from '@/lib/cursos/api'
import type { CursoBack } from '@/lib/cursos/types'
import { getRegistroSlug, NIVEL_LABEL, AULA_NOMBRE } from '@/lib/cursos/types'

export const metadata: Metadata = {
  title: 'Cursos | Nodo Tecnológico Catamarca',
  description: 'Explorá la oferta de cursos gratuitos del Nodo Tecnológico de Catamarca.',
}

const REGISTRO_URL =
  process.env.NEXT_PUBLIC_REGISTRO_URL ?? 'https://registro.nodo.cc.gob.ar'

const NIVEL_COLOR: Record<string, string> = {
  PRINCIPIANTE: 'bg-green-100 text-green-800 border-green-200',
  INTERMEDIO:   'bg-amber-100 text-amber-800 border-amber-200',
  AVANZADO:     'bg-red-100   text-red-800   border-red-200',
}

function CursoCard({ curso }: { curso: CursoBack }) {
  const registroSlug = getRegistroSlug(curso)
  const aulaLabel    = curso.aula ? AULA_NOMBRE[curso.aula] : null

  return (
    <Card className="flex flex-col overflow-hidden border border-cyan-100 bg-white/80 backdrop-blur-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none">{curso.emoji || '📚'}</span>
            <div>
              <h2 className="text-lg font-bold leading-tight text-gray-900 text-balance">
                {curso.title}
              </h2>
              {curso.profe && (
                <p className="mt-0.5 text-xs text-muted-foreground">{curso.profe.nombre}</p>
              )}
            </div>
          </div>
          <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${NIVEL_COLOR[curso.level] ?? 'bg-gray-100 text-gray-800'}`}>
            {NIVEL_LABEL[curso.level] ?? curso.level}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 text-pretty">
          {curso.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
            <span>{curso.duration}</span>
          </div>
          {curso.maxParticipants && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
              <span>{curso.maxParticipants} cupos</span>
            </div>
          )}
          {aulaLabel && (
            <div className="flex items-center gap-1.5 col-span-2">
              <MapPin className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
              <span>{aulaLabel}</span>
            </div>
          )}
          {(curso.horaInicio || curso.fechaInicio) && (
            <div className="flex items-center gap-1.5 col-span-2">
              <CalendarDays className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
              <span>
                {curso.fechaInicio && new Date(curso.fechaInicio).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {curso.horaInicio && curso.horaFin && ` · ${curso.horaInicio}–${curso.horaFin} hs`}
              </span>
            </div>
          )}
          {curso.modules > 0 && (
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
              <span>{curso.modules} módulos</span>
            </div>
          )}
        </div>

        {curso.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {curso.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-cyan-50 pt-4">
        {registroSlug && curso.available ? (
          <Button asChild size="sm" className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
            <a href={`${REGISTRO_URL}/inscripcion/${registroSlug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Inscribirme
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="outline" disabled className="w-full cursor-not-allowed opacity-60">
            {curso.waitlistEnabled ? 'Lista de espera' : 'Sin inscripción activa'}
          </Button>
        )}
        <Button asChild size="sm" variant="ghost" className="w-full text-cyan-700 hover:text-cyan-800">
          <Link href={`/cursos/${curso.slug}`}>Ver detalle</Link>
        </Button>
      </CardFooter>
    </Card>
  )
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-600">Formación gratuita</p>
          <h1 className="mb-4 text-4xl font-bold text-balance md:text-5xl">
            Nuestros <span className="text-cyan-500">Cursos</span>
          </h1>
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
            <p className="mb-6 text-sm text-muted-foreground">
              {cursos.length} curso{cursos.length !== 1 ? 's' : ''} disponible{cursos.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cursos.map((curso) => <CursoCard key={curso.id} curso={curso} />)}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
EOF

# ── app/cursos/[id]/page.tsx ──────────────────────────────────────────────────
cat > 'app/cursos/[id]/page.tsx' << 'EOF'
// app/cursos/[id]/page.tsx — Server Component
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, MapPin, Users, BookOpen, ExternalLink, CalendarDays, ArrowLeft, GraduationCap, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCursoBySlug } from '@/lib/cursos/api'
import { getRegistroSlug, NIVEL_LABEL, AULA_NOMBRE } from '@/lib/cursos/types'

const REGISTRO_URL =
  process.env.NEXT_PUBLIC_REGISTRO_URL ?? 'https://registro.nodo.cc.gob.ar'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id: slug } = await params
  const curso = await getCursoBySlug(slug)
  if (!curso) return { title: 'Curso no encontrado | Nodo Tecnológico Catamarca' }
  return { title: `${curso.emoji} ${curso.title} | Nodo Tecnológico Catamarca`, description: curso.description }
}

export default async function CursoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params
  const curso = await getCursoBySlug(slug)
  if (!curso) notFound()

  const registroSlug = getRegistroSlug(curso)
  const aulaLabel    = curso.aula ? AULA_NOMBRE[curso.aula] : null

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link href="/cursos" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-cyan-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Todos los cursos
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-5xl leading-none">{curso.emoji || '📚'}</span>
                  <div>
                    <h1 className="text-3xl font-bold text-balance md:text-4xl">{curso.title}</h1>
                    {curso.profe && <p className="mt-1 text-sm text-muted-foreground">Docente: {curso.profe.nombre}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {curso.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  <Badge variant="outline" className="border-cyan-500 text-cyan-600">Presencial</Badge>
                  <Badge variant="outline">{NIVEL_LABEL[curso.level] ?? curso.level}</Badge>
                </div>
              </div>

              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-cyan-500" />Sobre el curso</CardTitle></CardHeader>
                <CardContent><p className="text-base text-muted-foreground leading-relaxed text-pretty">{curso.description}</p></CardContent>
              </Card>

              {curso.modules > 0 && (
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-cyan-500" />Contenido</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-gray-700">{curso.modules} módulo{curso.modules !== 1 ? 's' : ''}</span>
                      {curso.steps > 0 && ` · ${curso.steps} actividades`}
                    </p>
                  </CardContent>
                </Card>
              )}

              {curso.waitlistEnabled && (
                <Card className="border-amber-100 bg-amber-50/60">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                      <p className="text-sm text-amber-800 leading-relaxed">Este curso tiene lista de espera. Si los cupos se cubren, quedás en espera y te avisamos.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4 bg-white/80 backdrop-blur-sm border-cyan-100">
                <CardHeader><CardTitle className="text-base">Detalles</CardTitle></CardHeader>
                <CardContent className="space-y-4 pb-2">
                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                    <div><p className="font-semibold text-gray-700">Duración</p><p className="text-muted-foreground">{curso.duration}</p></div>
                  </div>
                  {aulaLabel && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                      <div><p className="font-semibold text-gray-700">Ubicación</p><p className="text-muted-foreground">{aulaLabel}</p></div>
                    </div>
                  )}
                  {(curso.horaInicio || curso.fechaInicio) && (
                    <div className="flex items-start gap-3 text-sm">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                      <div>
                        <p className="font-semibold text-gray-700">Horario</p>
                        {curso.fechaInicio && <p className="text-muted-foreground">{new Date(curso.fechaInicio).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                        {curso.horaInicio && curso.horaFin && <p className="text-muted-foreground">{curso.horaInicio} – {curso.horaFin} hs</p>}
                      </div>
                    </div>
                  )}
                  {curso.maxParticipants && (
                    <div className="flex items-start gap-3 text-sm">
                      <Users className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                      <div><p className="font-semibold text-gray-700">Cupos</p><p className="text-muted-foreground">{curso.maxParticipants} participantes{curso.waitlistEnabled && ' + lista de espera'}</p></div>
                    </div>
                  )}
                  {curso.profe && (
                    <div className="flex items-start gap-3 text-sm">
                      <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                      <div><p className="font-semibold text-gray-700">Docente</p><p className="text-muted-foreground">{curso.profe.nombre}</p></div>
                    </div>
                  )}
                </CardContent>
                <div className="p-6 pt-2 space-y-2">
                  {registroSlug && curso.available ? (
                    <Button asChild size="lg" className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
                      <a href={`${REGISTRO_URL}/inscripcion/${registroSlug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />Inscribirme al curso
                      </a>
                    </Button>
                  ) : (
                    <Button size="lg" variant="outline" disabled className="w-full cursor-not-allowed opacity-60">Sin inscripción activa</Button>
                  )}
                  {curso.whatsappLink && (
                    <Button asChild size="sm" variant="ghost" className="w-full text-green-700 hover:text-green-800 hover:bg-green-50">
                      <a href={curso.whatsappLink} target="_blank" rel="noopener noreferrer">Grupo de WhatsApp</a>
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
EOF

echo ""
echo "✅ Archivos escritos:"
echo "   lib/cursos/types.ts"
echo "   lib/cursos/api.ts"
echo "   app/cursos/page.tsx"
echo "   app/cursos/[id]/page.tsx"
echo ""
echo "⚠️  Secrets a agregar en GitHub Actions (deploy.yml + servidor):"
echo "   NEXT_PUBLIC_CURSOS_API_URL=https://api.cursos.nodo.cc.gob.ar"
echo "   NEXT_PUBLIC_REGISTRO_URL=https://registro.nodo.cc.gob.ar"
echo ""
echo "   Y en .env.local para dev."