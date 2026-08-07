// app/cursos/[id]/page.tsx — Server Component
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, MapPin, Users, BookOpen, ExternalLink, CalendarDays, ArrowLeft, GraduationCap, CheckCircle2, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCursoBySlug } from '@/lib/cursos/api'
import { tieneInscripcionActiva, NIVEL_LABEL, AULA_NOMBRE } from '@/lib/cursos/types'
import { InscribirseBtn } from '@/components/cursos/inscribirse-btn'

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

  const puedeInscribirse = tieneInscripcionActiva(curso) && curso.available
  const aulaLabel        = curso.aula ? AULA_NOMBRE[curso.aula] : null

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link href="/cursos" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#26a7fc] transition-colors">
            <ArrowLeft className="h-4 w-4" />Todos los cursos
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
                  <Badge variant="outline" className="border-cyan-500 text-[#26a7fc]">Presencial</Badge>
                  <Badge variant="outline">{NIVEL_LABEL[curso.level] ?? curso.level}</Badge>
                </div>
              </div>
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#26a7fc]" />Sobre el curso</CardTitle></CardHeader>
                <CardContent><p className="text-base text-muted-foreground leading-relaxed text-pretty">{curso.description}</p></CardContent>
              </Card>
              {curso.modules > 0 && (
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-[#26a7fc]" />Contenido</CardTitle></CardHeader>
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
              <Card className="sticky top-4 bg-white/80 backdrop-blur-sm border-[#26a7fc]/10">
                <CardHeader><CardTitle className="text-base">Detalles</CardTitle></CardHeader>
                <CardContent className="space-y-4 pb-2">
                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#26a7fc]" />
                    <div><p className="font-semibold text-gray-700">Duración</p><p className="text-muted-foreground">{curso.duration}</p></div>
                  </div>
                  {aulaLabel && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#26a7fc]" />
                      <div><p className="font-semibold text-gray-700">Ubicación</p><p className="text-muted-foreground">{aulaLabel}</p></div>
                    </div>
                  )}
                  {(curso.horaInicio || curso.fechaInicio) && (
                    <div className="flex items-start gap-3 text-sm">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#26a7fc]" />
                      <div>
                        <p className="font-semibold text-gray-700">Horario</p>
                        {curso.fechaInicio && <p className="text-muted-foreground">{new Date(curso.fechaInicio).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                        {curso.horaInicio && curso.horaFin && <p className="text-muted-foreground">{curso.horaInicio} – {curso.horaFin} hs</p>}
                      </div>
                    </div>
                  )}
                  {curso.maxParticipants && (
                    <div className="flex items-start gap-3 text-sm">
                      <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#26a7fc]" />
                      <div><p className="font-semibold text-gray-700">Cupos</p><p className="text-muted-foreground">{curso.maxParticipants} participantes{curso.waitlistEnabled && ' + lista de espera'}</p></div>
                    </div>
                  )}
                  {curso.profe && (
                    <div className="flex items-start gap-3 text-sm">
                      <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-[#26a7fc]" />
                      <div><p className="font-semibold text-gray-700">Docente</p><p className="text-muted-foreground">{curso.profe.nombre}</p></div>
                    </div>
                  )}
                </CardContent>
                <div className="p-6 pt-2 space-y-2">
                  {puedeInscribirse ? (
                    <InscribirseBtn slug={curso.slug} />
                  ) : (
                    <Button size="lg" variant="outline" disabled className="w-full cursor-not-allowed opacity-60">Sin inscripción activa</Button>
                  )}
                  {curso.whatsappLink && (
                    <Button asChild size="sm" variant="ghost" className="w-full text-green-700 hover:text-green-800 hover:bg-green-50">
                      <a href={curso.whatsappLink} target="_blank" rel="noopener noreferrer">Grupo de WhatsApp</a>
                    </Button>
                  )}
                  <Button asChild size="sm" variant="outline" className="w-full gap-2 border-[#26a7fc]/20 text-[#1c8fe0] hover:bg-[#26a7fc]/10 hover:text-cyan-800">
                    <a href="https://profe.nodo.cc.gob.ar" target="_blank" rel="noopener noreferrer">
                      <Sparkles className="h-4 w-4" />
                      Aprender con el Profe IA
                    </a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
