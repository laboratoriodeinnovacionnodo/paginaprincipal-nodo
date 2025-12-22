"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Armchair, Users, MapPin, Clock, Navigation, Loader2 } from "lucide-react"
import { useCoworking } from "@/hooks/coworking/use-coworking"
import { obtenerColorBadge, obtenerTextoEstado, contarPorEstado } from "@/lib/coworking/utils"

export default function CoworkingPage() {
  const { asientos, ultimaActualizacion, loading } = useCoworking()

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <main>
        <section className="relative overflow-hidden pt-24 pb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold text-balance md:text-6xl">
              Áreas del <span className="text-cyan-500">Coworking</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4 text-pretty max-w-3xl mx-auto leading-relaxed">
              Consulta en tiempo real la disponibilidad de las áreas de trabajo. Visualiza el estado de cada espacio
              antes de visitar nuestras instalaciones.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Última actualización: {ultimaActualizacion}</span>
            </div>
          </div>
        </section>

        <section className="pb-6">
          <div className="container mx-auto px-4">
            {!loading && asientos.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap justify-center gap-4 py-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 hover:bg-green-500 border-green-500 border-2">
                      <Armchair className="h-3 w-3 mr-1" />
                      Libre
                    </Badge>
                    <span className="text-sm text-muted-foreground">({contarPorEstado(asientos, "libre")})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600 hover:bg-red-600 border-red-600 border-2">
                      <Armchair className="h-3 w-3 mr-1" />
                      Ocupado
                    </Badge>
                    <span className="text-sm text-muted-foreground">({contarPorEstado(asientos, "ocupado")})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-500 hover:bg-gray-500 border-gray-500 border-2">
                      <Armchair className="h-3 w-3 mr-1" />
                      Fuera de servicio
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({contarPorEstado(asientos, "fuera-servicio")})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500 hover:bg-blue-500 border-blue-500 border-2">
                      <Armchair className="h-3 w-3 mr-1" />
                      Limpiando
                    </Badge>
                    <span className="text-sm text-muted-foreground">({contarPorEstado(asientos, "limpiando")})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-500 hover:bg-orange-500 border-orange-500 border-2">
                      <Users className="h-3 w-3 mr-1" />
                      Para compartir
                    </Badge>
                    <span className="text-sm text-muted-foreground">({contarPorEstado(asientos, "compartir")})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-600 hover:bg-orange-600 border-orange-600 border-2">
                      <Users className="h-3 w-3 mr-1" />
                      Compartido
                    </Badge>
                    <span className="text-sm text-muted-foreground">({contarPorEstado(asientos, "compartido")})</span>
                  </div>
                </div>
              </div>
            )}

            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-cyan-500 mb-4" />
                    <p className="text-muted-foreground">Cargando áreas del coworking...</p>
                  </div>
                ) : asientos.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No hay áreas disponibles en este momento.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {asientos.map((asiento) => (
                      <Link key={asiento.id} href={`/coworking/${asiento.numero}`}>
                        <div className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 relative">
                            <Image
                              src={asiento.imagen || "/placeholder.svg"}
                              alt={asiento.nombre}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                            {/* Badge de estado */}
                            <div className="absolute top-2 right-2">
                              <Badge className={`${obtenerColorBadge(asiento.estado)} text-white border-2 text-xs`}>
                                {obtenerTextoEstado(asiento.estado)}
                              </Badge>
                            </div>

                            {/* Número del asiento */}
                            <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg font-bold text-base shadow-lg border border-white/20">
                              #{asiento.numero}
                            </div>

                            {/* Notificaciones */}
                            {asiento.notificaciones && (
                              <div className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-md z-10">
                                {asiento.notificaciones}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-8 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 text-white border-0 shadow-2xl">
              <CardContent className="text-center py-8 px-6">
                <h2 className="text-2xl font-bold text-white mb-4">Sistema de Reservas</h2>
                <p className="text-lg text-white/95 max-w-2xl mx-auto text-pretty leading-relaxed mb-6">
                  Las reservas se realizan <strong>por orden de llegada</strong> directamente en nuestras oficinas. Esta
                  página es <strong>únicamente informativa</strong> para que puedas consultar el estado de los asientos
                  en tiempo real antes de visitarnos.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 text-white/95">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-semibold">Horarios de Atención</p>
                      <p className="text-sm">Lunes a Viernes: 8:00 - 20:00</p>
                      <p className="text-sm">Sábados: 9:00 - 14:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-semibold">Ubicación</p>
                      <p className="text-sm">Av. Principal 123, Catamarca</p>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-white text-cyan-600 hover:bg-gray-100 font-semibold"
                  onClick={() => window.open("https://maps.google.com", "_blank")}
                >
                  <Navigation className="mr-2 h-5 w-5" />
                  Cómo Llegar al Edificio
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
