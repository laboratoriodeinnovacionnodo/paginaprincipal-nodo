"use client"
import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Loader2, ExternalLink, Shield, Calendar, Award } from "lucide-react"
import { getDiplomaById } from "@/lib/graduados/api"
import { useState, useEffect } from "react"
import type { Graduado } from "@/lib/graduados/types"

export default function DiplomaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [graduado, setGraduado] = useState<Graduado | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGraduado = async () => {
      try {
        setLoading(true)
        const data = await getDiplomaById(Number(id))

        setGraduado(data)
        if (!data) {
          setError("Diploma no encontrado")
        }
      } catch (err) {
        console.error("Error al cargar diploma:", err)
        setError("Error al cargar el diploma")
      } finally {
        setLoading(false)
      }
    }

    fetchGraduado()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Cargando diploma...</p>
        </div>
      </main>
    )
  }

  if (error || !graduado) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Diploma no encontrado</h1>
          <p className="text-muted-foreground mb-6">No se encontró ningún diploma con el identificador especificado</p>
          <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
            <Link href="/graduados">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Graduados
            </Link>
          </Button>
        </div>
      </main>
    )
  }

  const fechaFormateada = new Date(graduado.fechaGraduacion).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .diploma-container {
            box-shadow: none !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <section className="relative overflow-hidden pt-24 pb-12 no-print">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="mb-6 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50">
            <Link href="/graduados">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Graduados
            </Link>
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12">
        {graduado.txHash && (
          <div className="max-w-4xl mx-auto mb-8 no-print">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border-2 border-cyan-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Diploma Verificado en Blockchain</h3>
                  <p className="text-sm text-muted-foreground">Este diploma está certificado en Polygon</p>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">ID del Diploma</p>
                    <p className="text-sm text-gray-600 font-mono">{graduado.id}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">Hash de Transacción</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600 font-mono truncate">{graduado.txHash}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(graduado.txHash || "")}
                        className="flex-shrink-0 h-7 w-7 p-0"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>

                {graduado.explorerUrl && (
                  <div className="pt-4">
                    <Button asChild variant="outline" className="w-full bg-white hover:bg-cyan-50">
                      <a href={graduado.explorerUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver en PolygonScan
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Este diploma está registrado permanentemente en la blockchain de Polygon y no puede ser alterado ni
                    falsificado.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto diploma-container">
          {/* Diploma with decorative border */}
          <div className="bg-white shadow-2xl relative p-8 md:p-16">
            {/* Decorative border */}
            <div className="absolute inset-4 border-4 border-double border-cyan-600 pointer-events-none"></div>
            <div className="absolute inset-6 border border-cyan-400 pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10 space-y-8 text-center">
              {/* Header ornament */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z"
                    />
                  </svg>
                </div>
              </div>

              {/* Institution name */}
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                  {graduado.institucion || "Nodo Tecnológico Catamarca"}
                </h1>
                <div className="flex items-center justify-center gap-2 text-cyan-600">
                  <div className="h-px w-12 bg-cyan-600"></div>
                  <span className="text-sm font-medium tracking-wider uppercase">Certificado de Graduación</span>
                  <div className="h-px w-12 bg-cyan-600"></div>
                </div>
              </div>

              {/* Certification text */}
              <div className="space-y-6 py-8">
                <p className="text-lg text-gray-600 font-light">Por medio del presente se certifica que</p>

                <div className="py-4">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                    {graduado.nombre} {graduado.apellido}
                  </h2>
                  <div className="mt-2 mx-auto w-64 h-px bg-gradient-to-r from-transparent via-cyan-600 to-transparent"></div>
                </div>

                <p className="text-base text-gray-600">
                  <span className="font-medium">DNI:</span> {graduado.dni}
                </p>

                <p className="text-lg text-gray-600 font-light">
                  ha completado satisfactoriamente el programa de formación
                </p>

                <div className="py-4">
                  <h3 className="text-2xl md:text-3xl font-semibold text-cyan-700">{graduado.curso}</h3>
                  {graduado.duracion && <p className="text-sm text-gray-600 mt-2">Duración: {graduado.duracion}</p>}
                  {graduado.nivel && <p className="text-sm text-gray-600">Nivel: {graduado.nivel}</p>}
                </div>

                <p className="text-base text-gray-600">Otorgado el {fechaFormateada}</p>

                {graduado.txHash && (
                  <div className="flex justify-center">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1">
                      <Shield className="h-3 w-3 mr-1" />
                      Verificado en Blockchain
                    </Badge>
                  </div>
                )}
              </div>

              {/* Signatures */}
              <div className="grid md:grid-cols-2 gap-12 pt-12 mt-12 border-t border-gray-300">
                <div className="text-center space-y-2">
                  <div className="mb-4">
                    <div className="inline-block">
                      <div className="w-48 border-t-2 border-gray-800"></div>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">Dr. Roberto Guzmán</p>
                  <p className="text-sm text-gray-600">Director</p>
                  <p className="text-xs text-gray-500">Nodo Tecnológico Catamarca</p>
                </div>

                <div className="text-center space-y-2">
                  <div className="mb-4">
                    <div className="inline-block">
                      <div className="w-48 border-t-2 border-gray-800"></div>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">Lic. María Fernández</p>
                  <p className="text-sm text-gray-600">Coordinadora Académica</p>
                  <p className="text-xs text-gray-500">Programas de Formación</p>
                </div>
              </div>

              {/* Footer seal */}
              <div className="pt-8 flex justify-center items-center gap-4 text-xs text-gray-500">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-600 flex items-center justify-center">
                  <span className="font-bold text-cyan-600">NT</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Certificado Oficial</p>
                  <p>Registro N° {String(graduado.id).padStart(6, "0")}</p>
                  {graduado.txHash && (
                    <p className="font-mono text-[10px] text-cyan-600">
                      {graduado.txHash.substring(0, 10)}...{graduado.txHash.substring(graduado.txHash.length - 8)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Download button */}
          <div className="mt-8 text-center no-print">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600" onClick={() => window.print()}>
              <Download className="h-5 w-5 mr-2" />
              Descargar Diploma
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
