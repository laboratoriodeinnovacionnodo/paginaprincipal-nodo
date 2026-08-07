"use client"


import { CodeTitle } from "@/components/shared/code-title"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { CounterStat } from "../counter-stat"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Video de fondo */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://www.pexels.com/download/video/14994578/"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Capa de overlay para oscurecer el video */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Contenido */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <CodeTitle as="h1" className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight" immediate>
            Conecta, Innova y <span className="text-primary">Crea el Futuro</span>
          </CodeTitle>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty text-white/75">
            El Nodo Tecnológico de Catamarca conecta innovación y Tecnología, impulsando a los jóvenes hacia las
            habilidades del futuro a través de cursos especializados.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-base" asChild>
              <Link href="/cursos">
                Ver nuestros cursos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
              <Link href="/sobre-nosotros">Sobre el Nodo</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 max-w-md mx-auto">
            <CounterStat end={12000} label="Egresados" />
            <CounterStat end={25} label="Cursos disponibles" />
          </div>
        </div>
      </div>
    </section>
  )
}
