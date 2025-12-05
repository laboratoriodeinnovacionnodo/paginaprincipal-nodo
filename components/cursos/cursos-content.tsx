"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Users } from "lucide-react"
import { filterCursos, getTagsByModalidad } from "@/lib/cursos/filters"
import { useCursosFilter } from "@/hooks/cursos/use-cursos-filter"
import { CursoFiltros } from "@/components/cursos/curso-filtros"
import { Paginacion } from "@/components/shared/paginacion"
import type { Curso } from "@/lib/cursos/types"

interface CursosContentProps {
  todosCursos: Curso[]
  cursosPresenciales: Curso[]
  cursosVirtuales: Curso[]
}

export function CursosContent({ todosCursos, cursosPresenciales, cursosVirtuales }: CursosContentProps) {
  const {
    modalidadActiva,
    tagsSeleccionados,
    busqueda,
    paginaActual,
    setModalidadActiva,
    toggleTag,
    setBusqueda,
    setPaginaActual,
    limpiarFiltros,
  } = useCursosFilter()

  const cursosBase =
    modalidadActiva === "todos" ? todosCursos : modalidadActiva === "presencial" ? cursosPresenciales : cursosVirtuales

  const cursosFiltrados = filterCursos(cursosBase, modalidadActiva, tagsSeleccionados, busqueda)

  const totalPaginas = Math.ceil(cursosFiltrados.length / 6)
  const indiceInicio = (paginaActual - 1) * 6
  const indiceFin = indiceInicio + 6
  const cursosPaginados = cursosFiltrados.slice(indiceInicio, indiceFin)

  const tagsDisponibles = getTagsByModalidad(todosCursos, cursosPresenciales, cursosVirtuales, modalidadActiva)

  return (
    <>
      <section className="pb-4">
        <div className="container mx-auto px-4">
          <CursoFiltros
            modalidadActiva={modalidadActiva}
            tagsSeleccionados={tagsSeleccionados}
            busqueda={busqueda}
            tagsDisponibles={tagsDisponibles}
            onModalidadChange={setModalidadActiva}
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
              {cursosFiltrados.length} {cursosFiltrados.length === 1 ? "curso encontrado" : "cursos encontrados"}
            </p>
          </div>

          {cursosFiltrados.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">No se encontraron cursos con los filtros seleccionados</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cursosPaginados.map((curso) => (
                  <Card
                    key={curso.id}
                    className="flex flex-col transition-shadow hover:shadow-lg bg-white/70 backdrop-blur-sm"
                  >
                    <CardHeader>
                      <div className="mb-2 flex flex-wrap gap-1">
                        {curso.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-balance">{curso.titulo}</CardTitle>
                      <CardDescription className="text-pretty leading-relaxed">{curso.descripcion}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{curso.duracion}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{curso.cupo} cupos disponibles</span>
                        </div>
                        {curso.ubicacion && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{curso.ubicacion}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button asChild className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                        <Link href={`/cursos/${curso.slug}`}>Ver detalles</Link>
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
