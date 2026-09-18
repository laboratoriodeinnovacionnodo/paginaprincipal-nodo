/**
 * components/home/hero-section.tsx
 * Server Component.
 *
 * El admin marca el highlight con **texto** en el CMS.
 * Ej: "Conecta, Innova y **Crea el Futuro**"
 *   → "Conecta, Innova y " (animado en blanco) + "Crea el Futuro" (azul NODO)
 *
 * CodeTitle es "use client" pero puede importarse desde un Server Component.
 */

import Link              from "next/link"
import { ArrowRight }    from "lucide-react"
import { Button }        from "@/components/ui/button"
import { CounterStat }   from "@/components/counter-stat"
import { CodeTitle }     from "@/components/shared/code-title"
import { getLandingConfig } from "@/lib/landing"

function parseTitulo(titulo: string): { before: string; highlight: string } {
  const match = titulo.match(/^([\s\S]*?)\*([\s\S]+?)\*\s*$/)
  if (!match) return { before: titulo, highlight: '' }
  return { before: match[1], highlight: match[2] }
}

export async function HeroSection() {
  const config                = await getLandingConfig()
  const { before, highlight } = parseTitulo(config.titulo)

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

      {/* Video de fondo */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={config.videoUrl}
        autoPlay loop muted playsInline
        aria-hidden="true"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />

      {/* Contenido */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20
                          backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-semibold
                          text-white/80 mb-8 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#26a7fc] animate-pulse" aria-hidden="true" />
            Nodo Tecnológico · Catamarca, Argentina
          </div>

          {/* H1 con animación CodeTitle */}
          <CodeTitle
            as="h1"
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance
                       leading-[1.1] tracking-tight text-white"
            immediate
            stagger={70}
            duration={700}
          >
            {before}
            {highlight && (
              <span className="text-[#26a7fc]">{highlight}</span>
            )}
          </CodeTitle>

          {/* Subtítulo */}
          <p
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-pretty
                       text-white/70 leading-relaxed font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {config.descripcion}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-20">
            <Link href="/cursos">
              <Button
                size="lg"
                className="gap-2 bg-[#26a7fc] hover:bg-[#1c8fe0] text-white rounded-xl
                           shadow-[0_4px_20px_rgba(38,167,252,0.4)] font-semibold px-8
                           transition-all duration-200 hover:scale-105"
                aria-label="Ver cursos del Nodo Tecnológico"
              >
                Ver nuestros cursos
                <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={1.5} />
              </Button>
            </Link>
            <Link href="/sobre-nosotros">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-white/30 text-white hover:bg-white/10
                           hover:border-white/50 px-8 font-semibold backdrop-blur-sm bg-transparent
                           transition-all duration-200"
                aria-label="Conocer más sobre el Nodo"
              >
                Sobre el Nodo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0">
            <div className="flex flex-col items-center">
              <CounterStat end={1200} suffix="+" label="Alumnos formados" />
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/20 mx-8" aria-hidden="true" />
            <div className="flex flex-col items-center">
              <CounterStat end={25} suffix="+" label="Cursos disponibles" />
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/20 mx-8" aria-hidden="true" />
            <div className="flex flex-col items-center">
              <CounterStat end={3} suffix="" label="Áreas del laboratorio" />
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/20 mx-8" aria-hidden="true" />
            <div className="flex flex-col items-center">
              <CounterStat end={12} suffix="+" label="Proyectos activos" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
