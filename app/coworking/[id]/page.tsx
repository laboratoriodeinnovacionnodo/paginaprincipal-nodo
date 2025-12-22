"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Users, Clock, MapPin, Check, Monitor, Calendar, DollarSign, X, Loader2, ArrowLeft } from "lucide-react"
import { getAreaById } from "@/lib/coworking/api"
import type { AreaCoworkingAPI } from "@/lib/coworking/types"

export default function EspacioDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null)
  const [espacio, setEspacio] = useState<AreaCoworkingAPI | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarArea = async () => {
      setLoading(true)
      const areaId = Number.parseInt(params.id)
      if (isNaN(areaId)) {
        notFound()
        return
      }

      const area = await getAreaById(areaId)
      if (!area) {
        notFound()
        return
      }

      setEspacio(area)
      setLoading(false)
    }

    cargarArea()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-500 mb-4" />
              <p className="text-muted-foreground">Cargando información del espacio...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!espacio) {
    notFound()
  }

  const imagenesParaMostrar =
    espacio.imagenesAdicionales && espacio.imagenesAdicionales.length > 0
      ? espacio.imagenesAdicionales
      : [
          espacio.imagen || "/modern-coworking-space.png",
          espacio.imagen || "/coworking-meeting-room.jpg",
          espacio.imagen || "/coworking-desk.jpg",
        ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-4" onClick={() => router.push("/coworking")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a áreas
          </Button>

          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-balance mb-2">{espacio.nombre}</h1>
                <Badge
                  variant={espacio.disponible ? "default" : "secondary"}
                  className={`text-sm px-3 py-1 ${espacio.disponible ? "bg-green-500" : "bg-gray-500"}`}
                >
                  {espacio.disponible ? "Disponible" : "Ocupado Actualmente"}
                </Badge>
              </div>
              {espacio.precio && (
                <div className="text-right">
                  <p className="text-3xl font-bold text-cyan-600">{espacio.precio}</p>
                </div>
              )}
            </div>

            {espacio.descripcion && (
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed mb-8">{espacio.descripcion}</p>
            )}
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main large image */}
              <div
                className="relative h-[400px] md:col-span-2 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                onClick={() => setImagenSeleccionada(imagenesParaMostrar[0])}
              >
                <Image
                  src={imagenesParaMostrar[0] || "/placeholder.svg"}
                  alt={`${espacio.nombre} - Imagen principal`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-4">
                    <Monitor className="h-8 w-8 text-cyan-600" />
                  </div>
                </div>
              </div>

              {/* Two smaller images stacked */}
              <div className="flex flex-col gap-4">
                <div
                  className="relative h-[192px] rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                  onClick={() => setImagenSeleccionada(imagenesParaMostrar[1])}
                >
                  <Image
                    src={imagenesParaMostrar[1] || "/placeholder.svg"}
                    alt={`${espacio.nombre} - Imagen 2`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                      <Monitor className="h-6 w-6 text-cyan-600" />
                    </div>
                  </div>
                </div>
                <div
                  className="relative h-[192px] rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                  onClick={() => setImagenSeleccionada(imagenesParaMostrar[2])}
                >
                  <Image
                    src={imagenesParaMostrar[2] || "/placeholder.svg"}
                    alt={`${espacio.nombre} - Imagen 3`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                      <Monitor className="h-6 w-6 text-cyan-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Dialog open={!!imagenSeleccionada} onOpenChange={() => setImagenSeleccionada(null)}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-50 bg-white/90 hover:bg-white"
                onClick={() => setImagenSeleccionada(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              {imagenSeleccionada && (
                <div className="relative w-full h-[70vh]">
                  <Image
                    src={imagenSeleccionada || "/placeholder.svg"}
                    alt="Vista ampliada"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="lg:col-span-2 space-y-6">
              {espacio.usosPrincipales && espacio.usosPrincipales.length > 0 && (
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-cyan-600" />
                      Usos Principales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {espacio.usosPrincipales.map((uso, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                          <span className="text-pretty leading-relaxed">{uso}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {espacio.caracteristicas && espacio.caracteristicas.length > 0 && (
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-cyan-600" />
                      Características Destacadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {espacio.caracteristicas.map((caracteristica, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                          <span className="text-pretty leading-relaxed">{caracteristica}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {espacio.detalles && (
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Especificaciones Técnicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {espacio.detalles.area && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-cyan-600" />
                          Área Total
                        </h4>
                        <p className="text-muted-foreground">{espacio.detalles.area}</p>
                      </div>
                    )}
                    {espacio.detalles.iluminacion && (
                      <div>
                        <h4 className="font-semibold mb-2">Iluminación</h4>
                        <p className="text-muted-foreground">{espacio.detalles.iluminacion}</p>
                      </div>
                    )}
                    {espacio.detalles.mobiliario && espacio.detalles.mobiliario.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Mobiliario Incluido</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          {espacio.detalles.mobiliario.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {espacio.detalles.tecnologia && espacio.detalles.tecnologia.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Tecnología Disponible</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          {espacio.detalles.tecnologia.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Información Rápida</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-cyan-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">Capacidad</p>
                      <p className="text-sm text-muted-foreground">
                        {espacio.capacidad} persona{espacio.capacidad > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  {espacio.precio && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-cyan-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Precio</p>
                        <p className="text-sm text-muted-foreground">{espacio.precio}</p>
                      </div>
                    </div>
                  )}
                  {espacio.detalles?.accesoHorario && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-cyan-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Horario de Acceso</p>
                        <p className="text-sm text-muted-foreground text-pretty">{espacio.detalles.accesoHorario}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {espacio.servicios && espacio.servicios.length > 0 && (
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Servicios Incluidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {espacio.servicios.map((servicio) => (
                        <Badge key={servicio} variant="outline" className="text-sm">
                          <Check className="h-3 w-3 mr-1" />
                          {servicio}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-white">¿Interesado en este espacio?</CardTitle>
                  <CardDescription className="text-white/90 text-pretty leading-relaxed">
                    Para reservar este espacio, acercate a nuestras oficinas o contactanos para coordinar una visita y
                    conocer todas las facilidades disponibles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Av. Principal 123, Catamarca</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Lun-Vie: 8:00-20:00</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-white text-cyan-600 hover:bg-gray-100"
                    onClick={() => window.open("https://wa.me/", "_blank")}
                  >
                    Contactar para Reservar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
