"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Eye, Users, Lightbulb } from "lucide-react"
import { Organigrama } from "@/app/sobre-nosotros/components/organigrama"

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold text-balance md:text-6xl">
              Sobre <span className="text-cyan-500">Nosotros</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground text-balance leading-relaxed">
              El Nodo Tecnológico de Catamarca es un espacio de innovación y desarrollo que impulsa la transformación
              digital en nuestra provincia.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold text-cyan-600">Nuestros Valores</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white/70 backdrop-blur-sm border-cyan-100 text-center">
                <CardHeader>
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100">
                    <Lightbulb className="h-8 w-8 text-cyan-600" />
                  </div>
                  <CardTitle className="text-lg">Innovación</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-balance">
                    Promovemos la creatividad y el pensamiento disruptivo para generar soluciones tecnológicas.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-cyan-100 text-center">
                <CardHeader>
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100">
                    <Users className="h-8 w-8 text-cyan-600" />
                  </div>
                  <CardTitle className="text-lg">Inclusión</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-balance">
                    Creemos en la tecnología como herramienta de inclusión y desarrollo para toda la comunidad.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-cyan-100 text-center">
                <CardHeader>
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100">
                    <Target className="h-8 w-8 text-cyan-600" />
                  </div>
                  <CardTitle className="text-lg">Excelencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-balance">
                    Buscamos la calidad en cada proyecto, capacitación y servicio que ofrecemos a la comunidad.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-cyan-100 text-center">
                <CardHeader>
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100">
                    <Eye className="h-8 w-8 text-cyan-600" />
                  </div>
                  <CardTitle className="text-lg">Transparencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-balance">
                    Trabajamos con apertura y honestidad en todos nuestros procesos y comunicaciones.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Organigrama Section */}
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold text-cyan-600">Estructura Organizacional</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground text-balance">
                Conoce la estructura del Nodo Tecnológico y las diferentes áreas que trabajan para impulsar la
                transformación digital en Catamarca.
              </p>
            </div>
            <Organigrama />
          </div>
        </section>

        {/* Description Section */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <Card className="bg-white/70 backdrop-blur-sm border-cyan-100">
              <CardHeader>
                <CardTitle className="text-2xl text-cyan-600">¿Qué es el Nodo Tecnológico?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  El Nodo Tecnológico es una iniciativa de la Municipalidad de San Fernando del Valle de Catamarca que
                  busca promover el desarrollo tecnológico, la innovación y la capacitación en nuevas tecnologías. Nos
                  enfocamos en crear un ecosistema donde la comunidad pueda acceder a recursos, formación y espacios de
                  trabajo colaborativo.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  A través de nuestras diferentes áreas, trabajamos para impulsar la transformación digital del gobierno
                  local y brindar oportunidades de crecimiento a la comunidad, conectando talento local con las demandas
                  del mercado tecnológico actual.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
