"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Award } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { graduados } from "@/lib/graduados/data"
import { filterGraduados, getPromedioColor } from "@/lib/graduados/filters"
import { useGraduadosFilter } from "@/hooks/graduados/use-graduados-filter"
import { Paginacion } from "@/components/shared/paginacion"

export default function GraduadosPage() {
  const { busqueda, paginaActual, setBusqueda, setPaginaActual, limpiarBusqueda } = useGraduadosFilter()

  const itemsPorPagina = 10

  const graduadosFiltrados = filterGraduados(graduados, busqueda)

  const totalPaginas = Math.ceil(graduadosFiltrados.length / itemsPorPagina)
  const indiceInicio = (paginaActual - 1) * itemsPorPagina
  const indiceFin = indiceInicio + itemsPorPagina
  const graduadosPaginados = graduadosFiltrados.slice(indiceInicio, indiceFin)

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-balance md:text-6xl">
            Nuestros <span className="text-cyan-500">Graduados</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Celebramos el éxito de todos los estudiantes que completaron sus programas de formación
          </p>

          <div className="mx-auto max-w-2xl mt-12">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre, apellido o DNI..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value)
                  setPaginaActual(1)
                }}
                className="pl-10 bg-white/70 backdrop-blur-sm"
              />
            </div>

            {busqueda && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limpiarBusqueda}
                  className="text-cyan-600 hover:text-cyan-700"
                >
                  Limpiar búsqueda
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {graduadosFiltrados.length}{" "}
              {graduadosFiltrados.length === 1 ? "graduado encontrado" : "graduados encontrados"}
            </p>
          </div>

          {graduadosFiltrados.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">No se encontraron graduados con la búsqueda realizada</p>
            </div>
          ) : (
            <>
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold">Nombre</TableHead>
                          <TableHead className="font-semibold">DNI</TableHead>
                          <TableHead className="font-semibold">Curso</TableHead>
                          <TableHead className="font-semibold">Fecha de Graduación</TableHead>
                          <TableHead className="font-semibold text-center">Promedio</TableHead>
                          <TableHead className="font-semibold text-center">Diploma</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {graduadosPaginados.map((graduado) => (
                          <TableRow key={graduado.id} className="hover:bg-cyan-50/50">
                            <TableCell className="font-medium">
                              {graduado.nombre} {graduado.apellido}
                            </TableCell>
                            <TableCell>{graduado.dni}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {graduado.curso}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(graduado.fechaGraduacion).toLocaleDateString("es-AR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={getPromedioColor(graduado.promedio)}>
                                {graduado.promedio.toFixed(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button asChild size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                                <Link href={`/graduados/${graduado.id}`}>
                                  <Award className="h-4 w-4 mr-1" />
                                  Ver Diploma
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Paginacion paginaActual={paginaActual} totalPaginas={totalPaginas} onPaginaChange={setPaginaActual} />
            </>
          )}
        </div>
      </section>
    </main>
  )
}
