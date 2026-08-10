import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, MapPin, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getNoticiaBySlug, getNoticias } from "@/lib/strapi/api"
import Image from "next/image"

export default async function NoticiaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params
  const noticia = await getNoticiaBySlug(slug)

  if (!noticia) {
    notFound()
  }

  // Get related news
  const todasNoticias = await getNoticias()
  const noticiasRelacionadas = todasNoticias
    .filter((n) => n.id !== noticia.id && n.tags.some((tag) => noticia.tags.includes(tag)))
    .slice(0, 3)

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-50 via-white to-blue-50">
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              {/* Main Content */}
              <div className="space-y-6">
                <div>
                  <h1 className="mb-3 text-4xl font-bold text-balance leading-tight text-gray-900 lg:text-5xl">
                    {noticia.titulo}
                  </h1>

                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(noticia.fecha).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {noticia.covertura && (
                    <div className="mb-6 rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={noticia.covertura || "/placeholder.svg"}
                        alt={noticia.titulo}
                        width={1200}
                        height={600}
                        className="w-full h-auto object-cover"
                        priority
                      />
                    </div>
                  )}

                  <div className="prose prose-cyan max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">{noticia.contenido}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
                {/* Details Card */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Detalles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-[#26a7fc] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Fecha de Publicación</p>
                        <p className="text-sm text-gray-600">
                          {new Date(noticia.fecha).toLocaleDateString("es-AR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-[#26a7fc] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Autor</p>
                        <p className="text-sm text-gray-600">{noticia.autor}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#26a7fc] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Ubicación</p>
                        <p className="text-sm text-gray-600">Nodo Tecnológico</p>
                      </div>
                    </div>

                    {noticia.tags && noticia.tags.length > 0 && (
                      <div className="flex items-start gap-3 pt-2 border-t border-gray-200">
                        <Tag className="h-5 w-5 text-[#26a7fc] mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-2">Etiquetas</p>
                          <div className="flex flex-wrap gap-2">
                            {noticia.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="bg-[#26a7fc]/10 text-[#1c8fe0] border-[#26a7fc]/20">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button asChild className="w-full bg-[#1c8fe0] hover:bg-[#1c8fe0] text-white">
                    <Link href="/noticias">Volver a noticias</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Related News */}
            {noticiasRelacionadas.length > 0 && (
              <section className="mt-16">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Noticias relacionadas</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {noticiasRelacionadas.map((related) => (
                    <Card key={related.id} className="flex flex-col transition-shadow hover:shadow-lg border-gray-200">
                      <CardContent className="flex-1 p-6">
                        <div className="mb-3 flex flex-wrap gap-1">
                          {related.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-[#26a7fc]/10 text-cyan-800 border-[#26a7fc]/20"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="mb-2 font-semibold text-balance line-clamp-2 text-gray-900">{related.titulo}</h3>
                        <p className="mb-4 text-sm text-gray-600 line-clamp-3">{related.descripcion}</p>
                        <Button variant="link" className="p-0 h-auto text-[#26a7fc] hover:text-[#1c8fe0]" asChild>
                          <Link href={`/noticias/${related.slug}`}>Leer más →</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
