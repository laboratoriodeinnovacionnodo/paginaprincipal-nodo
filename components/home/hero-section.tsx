/**
 * components/home/hero-section.tsx
 * Server Component — datos desde noticias-back (ISR 60s).
 * El título acepta <span> para colorear la última parte en azul NODO.
 */

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button }       from "@/components/ui/button"
import { CodeTitle }    from "@/components/shared/code-title"
import { CounterStat }  from "@/components/counter-stat"
import { getLandingConfig } from "@/lib/landing"

// Divide el título en parte normal + parte coloreada (última "frase" separada por newline o "y Crea")
// El admin escribe el título completo; la convención es que el último fragmento
// tras la última coma queda en color primario.
function splitTitulo(titulo: string): { before: string; highlight: string } {
  // Divide por "y " (primera aparición) para mantener la estructura "Conecta, Innova y <span>"
  const idx = titulo.lastIndexOf(' y ')
  if (idx === -1) return { before: '', highlight: titulo }
  return {
    before:    titulo.slice(0, idx + 3), // incluye " y "
    highlight: titulo.slice(idx + 3),
  }
}

export async function HeroSection() {
  const config = await getLandingConfig()
  const { before, highlight } = splitTitulo(config.titulo)

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

      {/* Video de fondo — URL dinámica desde CMS */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={config.videoUrl}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Contenido */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">

          <CodeTitle
            as="h1"
            className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight"
            immediate
          >
            {before}
            <span className="text-primary">{highlight}</span>
          </CodeTitle>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty text-white/75">
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
                className="rounded-xl border-white/40 text-white hover:bg-white/10 px-8 font-semibold backdrop-blur-sm"
              >
                Sobre el Nodo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <CounterStat value={12000} suffix="+" label="Egresados" />
            <CounterStat value={25}    suffix="+" label="Cursos disponibles" />
          </div>

        </div>
      </div>
    </section>
  )
}
