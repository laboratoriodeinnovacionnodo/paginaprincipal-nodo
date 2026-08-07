"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User } from "lucide-react"
import { filterNoticias } from "@/lib/noticias/filters"
import { useNoticiasFilter } from "@/hooks/noticias/use-noticias-filter"
import { NoticiaFiltros } from "@/components/noticias/noticia-filtros"
import { Paginacion } from "@/components/shared/paginacion"
import type { Noticia } from "@/lib/noticias/types"

interface NoticiasContentProps {
  noticias: Noticia[]
}

export function NoticiasContent({ noticias }: NoticiasContentProps) {
  const { tagsSeleccionados, busqueda, paginaActual, toggleTag, setBusqueda, setPaginaActual, limpiarFiltros } =
    useNoticiasFilter()

  const noticiasFiltradas = filterNoticias(noticias, tagsSeleccionados, busqueda)

  const itemsPorPagina = 3
  const totalPaginas = Math.ceil(noticiasFiltradas.length / itemsPorPagina)
  const indiceInicio = (paginaActual - 1) * itemsPorPagina
  const indiceFin = indiceInicio + itemsPorPagina
  const noticiasPaginadas = noticiasFiltradas.slice(indiceInicio, indiceFin)

  const tagsDisponibles = Array.from(new Set(noticias.flatMap((n) => n.tags))).sort()

  return (
    <>
      <section className="pb-4">
        <div className="container mx-auto px-4">
          <NoticiaFiltros
            tagsSeleccionados={tagsSeleccionados}
            busqueda={busqueda}
            tagsDisponibles={tagsDisponibles}
            onToggleTag={toggleTag}
            onBusquedaChange={(value) => {
              setBusqueda(value)
              setPaginaActual(1)
            }}
            onLimpiarFiltros={limpiarFiltros}
          />
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {noticiasFiltradas.length}{" "}
              {noticiasFiltradas.length === 1 ? "noticia encontrada" : "noticias encontradas"}
            </p>
          </div>

          {noticiasFiltradas.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">No se encontraron noticias con los filtros seleccionados</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {noticiasPaginadas.map((noticia) => (
                  <Card
                    key={noticia.id}
                    className="flex flex-col transition-shadow hover:shadow-lg bg-white/70 backdrop-blur-sm"
                  >
                    <CardHeader>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {noticia.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-balance">{noticia.titulo}</CardTitle>
                      <CardDescription className="text-pretty leading-relaxed">{noticia.descripcion}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{noticia.fecha}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{noticia.autor}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full bg-[#26a7fc] hover:bg-[#1c8fe0]">
                        <Link href={`/noticias/${noticia.slug}`}>Leer más</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Paginacion paginaActual={paginaActual} totalPaginas={totalPaginas} onPaginaChange={setPaginaActual} />
            </>
          )}
        </div>
      </section>
    </>
  )
}
