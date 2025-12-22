"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Award, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getGraduadoByDni } from "@/lib/graduados/api"
import { useGraduadosFilter } from "@/hooks/graduados/use-graduados-filter"
import { useState } from "react"
import type { Graduado } from "@/lib/graduados/types"

export default function GraduadosPage() {
  const {
    busqueda,
    paginaActual,
    mostrarResultados,
    setBusqueda,
    setPaginaActual,
    setMostrarResultados,
    limpiarBusqueda,
  } = useGraduadosFilter()
  const [graduadoEncontrado, setGraduadoEncontrado] = useState<Graduado | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const itemsPorPagina = 10

  const buscarPorDni = async () => {
    if (!busqueda.trim()) return

    setLoading(true)
    setError(null)
    setMostrarResultados(true)

    try {
      const graduado = await getGraduadoByDni(busqueda.trim())
      setGraduadoEncontrado(graduado)
    } catch (err) {
      setError("Error al buscar el graduado. Por favor, intente nuevamente.")
      setGraduadoEncontrado(null)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      buscarPorDni()
    }
  }

  const graduadosFiltrados = mostrarResultados && graduadoEncontrado ? [graduadoEncontrado] : []
  const totalPaginas = Math.ceil(graduadosFiltrados.length / itemsPorPagina)

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-balance md:text-6xl">
            Nuestros <span className="text-cyan-500">Graduados</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Busca y verifica diplomas ingresando el DNI completo del graduado
          </p>

          <div className="mx-auto max-w-2xl mt-12">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ingrese el DNI completo para buscar..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-white/70 backdrop-blur-sm"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={buscarPorDni}
                disabled={loading || !busqueda.trim()}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>

            {busqueda && mostrarResultados && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    limpiarBusqueda()
                    setGraduadoEncontrado(null)
                    setError(null)
                  }}
                  className="text-cyan-600 hover:text-cyan-700"
                >
                  Limpiar búsqueda
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          {!mostrarResultados && (
            <div className="py-16 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-cyan-600" />
              </div>
              <p className="text-lg text-muted-foreground">
                Ingrese un DNI completo para buscar el diploma de un graduado
              </p>
            </div>
          )}

          {loading && (
            <div className="py-16 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Buscando graduado...</p>
            </div>
          )}

          {error && mostrarResultados && (
            <div className="py-16 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-red-600" />
              </div>
              <p className="text-lg text-red-600 mb-2">{error}</p>
              <Button onClick={buscarPorDni} variant="outline" className="mt-4 bg-transparent">
                Intentar nuevamente
              </Button>
            </div>
          )}

          {!loading && !error && mostrarResultados && graduadosFiltrados.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-yellow-600" />
              </div>
              <p className="text-lg text-muted-foreground">No se encontró ningún graduado con el DNI ingresado</p>
            </div>
          )}

          {!loading && !error && graduadosFiltrados.length > 0 && (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">Graduado encontrado</p>
              </div>

              <Card className="bg-white/70 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold">Nombre</TableHead>
                          <TableHead className="font-semibold">DNI</TableHead>
                          <TableHead className="font-semibold">Curso</TableHead>
                          <TableHead className="font-semibold text-center">Diploma</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {graduadosFiltrados.map((graduado) => (
                          <TableRow key={graduado.id} className="hover:bg-cyan-50/50">
                            <TableCell className="font-medium">{graduado.nombre}</TableCell>
                            <TableCell>{graduado.dni}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {graduado.curso}
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
            </>
          )}
        </div>
      </section>
    </main>
  )
}
