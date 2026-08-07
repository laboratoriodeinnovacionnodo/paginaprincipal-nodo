"use client"


import { CodeTitle } from "@/components/shared/code-title"
import { Header } from '@/components/header'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Sample data - replace with real data
const autoridades = [
  {
    id: 1,
    nombre: 'Dr. Juan Carlos Pérez',
    posicion: 'Director General',
    foto: '/professional-male-headshot.png',
    iniciales: 'JP',
  },
  {
    id: 2,
    nombre: 'Dra. María García',
    posicion: 'Subdirectora Académica',
    foto: '/professional-headshot-female.png',
    iniciales: 'MG',
  },
  {
    id: 3,
    nombre: 'Ing. Roberto Fernández',
    posicion: 'Coordinador de Innovación',
    foto: '/professional-male-headshot.png',
    iniciales: 'RF',
  },
  {
    id: 4,
    nombre: 'Lic. Ana Martínez',
    posicion: 'Jefa de Relaciones Institucionales',
    foto: '/professional-headshot-female.png',
    iniciales: 'AM',
  },
  {
    id: 5,
    nombre: 'Ing. Carlos López',
    posicion: 'Coordinador de Tecnología',
    foto: '/professional-male-headshot.png',
    iniciales: 'CL',
  },
  {
    id: 6,
    nombre: 'Dra. Laura Rodríguez',
    posicion: 'Directora de Investigación',
    foto: '/professional-headshot-female.png',
    iniciales: 'LR',
  },
]

export default function AutoridadesPage() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50 pt-24 pb-4">
          <div className="container mx-auto px-4 text-center">
            <CodeTitle as="h1" className="mb-6 text-4xl font-bold text-balance md:text-6xl">
              Nuestras <span className="text-[#26a7fc]">Autoridades</span>
            </CodeTitle>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground text-pretty leading-relaxed">
              Conoce al equipo directivo que lidera el Nodo Tecnológico de Catamarca
            </p>
          </div>
        </section>

        {/* Authorities Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {autoridades.map((autoridad) => (
                <Card
                  key={autoridad.id}
                  className="overflow-hidden transition-shadow hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="mb-4 h-32 w-32">
                        <AvatarImage
                          src={autoridad.foto || "/placeholder.svg"}
                          alt={autoridad.nombre}
                        />
                        <AvatarFallback className="bg-[#26a7fc] text-2xl text-white">
                          {autoridad.iniciales}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="mb-2 text-xl font-semibold text-balance">
                        {autoridad.nombre}
                      </h3>
                      <p className="text-sm text-[#26a7fc] font-medium">
                        {autoridad.posicion}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Buttons Section */}
            <div className="mt-12 flex justify-between">
              <Button size="lg" className="px-8 cursor-pointer">
                <Link href="/resultados">
                  Ver Resultados de Gestión
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 cursor-pointer">
                <Link href="/sectores">
                  Ver Áreas del Nodo
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
