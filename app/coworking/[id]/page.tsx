"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Users, Clock, MapPin, Check, Monitor, Calendar, DollarSign, X } from "lucide-react"

type Espacio = {
  id: number
  nombre: string
  descripcion: string
  capacidadMinima: number
  capacidadMaxima: number
  precio: string
  disponible: boolean
  servicios: string[]
  imagen: string
  imagenesAdicionales: string[]
  detalles: {
    area: string
    iluminacion: string
    mobiliario: string[]
    tecnologia: string[]
    accesoHorario: string
  }
  usosPrincipales: string[]
  caracteristicas: string[]
}

const espacios: Espacio[] = [
  {
    id: 1,
    nombre: "Sala de Reuniones Principal",
    descripcion:
      "Espacio amplio y versátil diseñado para reuniones corporativas, presentaciones ejecutivas y workshops colaborativos",
    capacidadMinima: 8,
    capacidadMaxima: 20,
    precio: "$5000/hora",
    disponible: true,
    servicios: ["WiFi", "Proyector", "Pizarra", "Aire Acondicionado"],
    imagen: "/modern-meeting-room.png",
    imagenesAdicionales: [
      "/modern-meeting-room.png",
      "/sala-de-reuniones-vista-lateral.jpg",
      "/sala-de-reuniones-equipamiento.jpg",
    ],
    detalles: {
      area: "45m²",
      iluminacion: "Natural y LED regulable",
      mobiliario: ["Mesa de conferencias", "Sillas ergonómicas", "Pizarra interactiva", "Estantería"],
      tecnologia: ["Proyector Full HD", "Sistema de audio", "Videoconferencia", "WiFi de alta velocidad"],
      accesoHorario: "Lunes a Viernes 8:00-20:00, Sábados 9:00-14:00",
    },
    usosPrincipales: [
      "Reuniones de equipo y planificación estratégica",
      "Presentaciones corporativas con clientes",
      "Workshops y capacitaciones",
      "Sesiones de brainstorming colaborativo",
    ],
    caracteristicas: [
      "Ambiente profesional y moderno",
      "Aislamiento acústico de alta calidad",
      "Climatización controlada",
      "Acceso a servicios de catering bajo pedido",
      "Soporte técnico disponible",
    ],
  },
  {
    id: 2,
    nombre: "Escritorio Individual",
    descripcion:
      "Espacio de trabajo personal optimizado para máxima productividad y concentración, ideal para profesionales independientes y emprendedores",
    capacidadMinima: 1,
    capacidadMaxima: 1,
    precio: "$3000/día",
    disponible: true,
    servicios: ["WiFi", "Enchufe", "Escritorio Ergonómico"],
    imagen: "/desk-workspace.jpg",
    imagenesAdicionales: [
      "/desk-workspace.jpg",
      "/escritorio-individual-vista-lateral.jpg",
      "/escritorio-individual-espacio-de-trabajo.jpg",
    ],
    detalles: {
      area: "2m²",
      iluminacion: "Lámpara de escritorio LED regulable",
      mobiliario: [
        "Escritorio regulable en altura",
        "Silla ergonómica certificada",
        "Archivador personal",
        "Porta laptop",
      ],
      tecnologia: ["Múltiples tomas de corriente", "Puerto USB de carga", "WiFi dedicado de alta velocidad"],
      accesoHorario: "Acceso 24/7 con tarjeta personalizada",
    },
    usosPrincipales: [
      "Trabajo remoto y freelancing",
      "Desarrollo de proyectos individuales",
      "Estudio e investigación",
      "Consultoría profesional",
    ],
    caracteristicas: [
      "Privacidad garantizada con divisores",
      "Cajón personal con cerradura",
      "Zona tranquila libre de distracciones",
      "Acceso a sala de descanso y cocina compartida",
      "Servicio de correo y paquetería",
    ],
  },
  {
    id: 3,
    nombre: "Sala Privada",
    descripcion:
      "Oficina privada completamente equipada para equipos pequeños que requieren confidencialidad, privacidad total y un ambiente profesional exclusivo",
    capacidadMinima: 2,
    capacidadMaxima: 6,
    precio: "$8000/día",
    disponible: false,
    servicios: ["WiFi", "Monitor", "Pizarra", "Privacidad"],
    imagen: "/private-office.jpg",
    imagenesAdicionales: [
      "/private-office.jpg",
      "/oficina-privada-vista-amplia.jpg",
      "/oficina-privada-area-de-trabajo.jpg",
    ],
    detalles: {
      area: "25m²",
      iluminacion: "Natural con ventanas amplias y LED ajustable",
      mobiliario: [
        "Mesa de reuniones",
        "6 sillas ejecutivas",
        "Escritorios individuales",
        "Armario de almacenamiento",
        "Sofá de recepción",
      ],
      tecnologia: [
        "Monitor 4K compartido",
        "Sistema de videoconferencia profesional",
        "Pizarra digital",
        "WiFi empresarial dedicado",
        "Sistema de seguridad",
      ],
      accesoHorario: "Acceso 24/7 con sistema de cerradura inteligente",
    },
    usosPrincipales: [
      "Oficina temporal para equipos de proyectos",
      "Reuniones confidenciales y negociaciones",
      "Trabajo colaborativo en proyectos sensibles",
      "Base de operaciones para startups",
    ],
    caracteristicas: [
      "Privacidad absoluta con puerta cerrada",
      "Línea telefónica dedicada disponible",
      "Personalización del espacio permitida",
      "Servicio de limpieza diario",
      "Recepción de visitas en área privada",
      "Opción de branding corporativo",
    ],
  },
  {
    id: 4,
    nombre: "Espacio Colaborativo",
    descripcion:
      "Área abierta y dinámica diseñada para fomentar la creatividad, el networking profesional y la colaboración espontánea entre emprendedores e innovadores",
    capacidadMinima: 2,
    capacidadMaxima: 10,
    precio: "$2000/hora",
    disponible: true,
    servicios: ["WiFi", "Café", "Pizarras", "Enchufes"],
    imagen: "/collaborative-workspace.png",
    imagenesAdicionales: [
      "/collaborative-workspace.png",
      "/espacio-colaborativo-vista-panoramica.jpg",
      "/espacio-colaborativo-area-de-trabajo-grupal.jpg",
    ],
    detalles: {
      area: "60m²",
      iluminacion: "Natural abundante y ambiente cálido",
      mobiliario: [
        "Mesas modulares",
        "Sillas cómodas variadas",
        "Puffs y sofás",
        "Múltiples pizarras móviles",
        "Estantes compartidos",
      ],
      tecnologia: [
        "WiFi de alta velocidad",
        "Múltiples puntos de carga",
        "Pantallas para compartir contenido",
        "Sistema de audio ambiental",
      ],
      accesoHorario: "Lunes a Viernes 8:00-20:00, Sábados 9:00-18:00",
    },
    usosPrincipales: [
      "Sesiones de coworking y networking",
      "Trabajo en equipo flexible",
      "Eventos de comunidad y meetups",
      "Proyectos colaborativos creativos",
    ],
    caracteristicas: [
      "Ambiente inspirador y energético",
      "Café y snacks incluidos",
      "Comunidad de emprendedores activa",
      "Eventos de networking regulares",
      "Zona de descanso integrada",
      "Conexión con mentores y profesionales",
    ],
  },
]

export default function EspacioDetailPage({ params }: { params: { id: string } }) {
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null)

  const espacio = espacios.find((e) => e.id === Number.parseInt(params.id))

  if (!espacio) {
    notFound()
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
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
              <div className="text-right">
                <p className="text-3xl font-bold text-cyan-600">{espacio.precio}</p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground text-pretty leading-relaxed mb-8">{espacio.descripcion}</p>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main large image */}
              <div
                className="relative h-[400px] md:col-span-2 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                onClick={() => setImagenSeleccionada(espacio.imagenesAdicionales[0])}
              >
                <Image
                  src={espacio.imagenesAdicionales[0] || "/placeholder.svg"}
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
                  onClick={() => setImagenSeleccionada(espacio.imagenesAdicionales[1])}
                >
                  <Image
                    src={espacio.imagenesAdicionales[1] || "/placeholder.svg"}
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
                  onClick={() => setImagenSeleccionada(espacio.imagenesAdicionales[2])}
                >
                  <Image
                    src={espacio.imagenesAdicionales[2] || "/placeholder.svg"}
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

              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Especificaciones Técnicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-cyan-600" />
                      Área Total
                    </h4>
                    <p className="text-muted-foreground">{espacio.detalles.area}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Iluminación</h4>
                    <p className="text-muted-foreground">{espacio.detalles.iluminacion}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Mobiliario Incluido</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {espacio.detalles.mobiliario.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tecnología Disponible</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {espacio.detalles.tecnologia.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
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
                        {espacio.capacidadMinima === espacio.capacidadMaxima
                          ? `${espacio.capacidadMaxima} persona${espacio.capacidadMaxima > 1 ? "s" : ""}`
                          : `${espacio.capacidadMinima}-${espacio.capacidadMaxima} personas`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-cyan-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">Precio</p>
                      <p className="text-sm text-muted-foreground">{espacio.precio}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-cyan-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">Horario de Acceso</p>
                      <p className="text-sm text-muted-foreground text-pretty">{espacio.detalles.accesoHorario}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                  <Button className="w-full bg-white text-cyan-600 hover:bg-gray-100">Contactar para Reservar</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
