import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Users, BookOpen, ExternalLink, Calendar, Sun, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCursoBySlug } from "@/lib/strapi/api"

export default async function CursoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params
  const curso = await getCursoBySlug(slug)

  if (!curso) {
    notFound()
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Header */}
              <div>
                <h1 className="mb-4 text-4xl font-bold text-balance md:text-5xl">{curso.titulo}</h1>
                <div className="mb-3 flex flex-wrap gap-2">
                  {curso.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  <Badge
                    variant="outline"
                    className={
                      curso.modalidad === "presencial"
                        ? "border-cyan-500 text-cyan-600"
                        : "border-blue-500 text-blue-600"
                    }
                  >
                    {curso.modalidad === "presencial" ? "Presencial" : "Virtual"}
                  </Badge>
                </div>
              </div>

              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-cyan-500" />
                    Información del Curso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground text-pretty leading-relaxed">{curso.descripcion}</p>
                </CardContent>
              </Card>

              {curso.requisitos && curso.requisitos.length > 0 && (
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cyan-500" />
                      Requisitos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {curso.requisitos.map((requisito, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                          <span className="text-sm leading-relaxed">{requisito}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Detalles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {curso.duracion && (
                    <div className="flex items-start gap-3">
                      <Clock className="mt-1 h-5 w-5 shrink-0 text-cyan-500" />
                      <div>
                        <p className="font-semibold">Duración</p>
                        <p className="text-sm text-muted-foreground">{curso.duracion}</p>
                      </div>
                    </div>
                  )}

                  {curso.cupos && (
                    <div className="flex items-start gap-3">
                      <Users className="mt-1 h-5 w-5 shrink-0 text-cyan-500" />
                      <div>
                        <p className="font-semibold">Cupos disponibles</p>
                        <p className="text-sm text-muted-foreground">{curso.cupos}</p>
                      </div>
                    </div>
                  )}

                  {curso.edad && (
                    <div className="flex items-start gap-3">
                      <Users className="mt-1 h-5 w-5 shrink-0 text-cyan-500" />
                      <div>
                        <p className="font-semibold">Edad</p>
                        <p className="text-sm text-muted-foreground">{curso.edad}</p>
                      </div>
                    </div>
                  )}

                  {curso.turno && (
                    <div className="flex items-start gap-3">
                      <Sun className="mt-1 h-5 w-5 shrink-0 text-cyan-500" />
                      <div>
                        <p className="font-semibold">Turno</p>
                        <p className="text-sm text-muted-foreground">{curso.turno}</p>
                      </div>
                    </div>
                  )}

                  {curso.publicadoEnFecha && (
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-1 h-5 w-5 shrink-0 text-cyan-500" />
                      <div>
                        <p className="font-semibold">Fecha de Publicación</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(curso.publicadoEnFecha).toLocaleDateString("es-AR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {curso.ubicacion && (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-5 w-5 shrink-0 text-cyan-500" />
                      <div>
                        <p className="font-semibold">Ubicación</p>
                        <p className="text-sm text-muted-foreground">{curso.ubicacion}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-3">
                    {curso.link && (
                      <Button className="w-full bg-cyan-500 hover:bg-cyan-600" size="lg" asChild>
                        <a
                          href={curso.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Ir al curso
                        </a>
                      </Button>
                    )}

                    <Button variant="outline" size="lg" className="w-full bg-transparent" asChild>
                      <Link href="/cursos">Volver a cursos</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
