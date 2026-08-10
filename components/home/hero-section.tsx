/**
 * components/home/hero-section.tsx
 * Server Component.
 *
 * El admin marca el highlight con **texto** en el CMS.
 * Ej: "Conecta, Innova y **Crea el Futuro**"
 *   → "Conecta, Innova y " (blanco) + "Crea el Futuro" (azul NODO)
 */

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button }      from "@/components/ui/button"
import { CounterStat } from "@/components/counter-stat"
import { getLandingConfig } from "@/lib/landing"

/**
 * Parsea **texto** y devuelve { before, highlight }.
 * Si no hay **, todo queda en before (blanco) sin highlight.
 */
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
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          <h1
            className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {before}
            {highlight && (
              <span className="text-[#26a7fc]">{highlight}</span>
            )}
          </h1>

          <p
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-pretty text-white/80 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {config.descripcion}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/cursos">
              <Button
                size="lg"
                className="gap-2 bg-[#26a7fc] hover:bg-[#26a7fc]/90 text-white rounded-xl
                           shadow-[0_4px_14px_rgba(38,167,252,0.35)] font-semibold px-8"
              >
                Ver nuestros cursos
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </Link>
            <Link href="/sobre-nosotros">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-white/40 text-white hover:bg-white/10
                           hover:border-white/60 px-8 font-semibold backdrop-blur-sm bg-transparent"
              >
                Sobre el Nodo
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <CounterStat end={12000} suffix="+" label="Egresados" />
            <CounterStat end={25}    suffix="+" label="Cursos disponibles" />
          </div>

        </div>
      </div>
    </section>
  )
}
