"use client"

import { CodeTitle } from "@/components/shared/code-title"
export function ContactHero() {
  return (
    <section className="pt-32 pb-16 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 text-center">
        <CodeTitle as="h1" className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          Conecta Con <span className="text-primary">Nosotros</span>
        </CodeTitle>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          Estamos aquí para responder tus preguntas y ayudarte a comenzar tu camino en tecnología
        </p>
      </div>
    </section>
  )
}
