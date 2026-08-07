"use client"

import { CodeTitle } from "@/components/shared/code-title"
export function ResultadosHero() {
  return (
    <section className="pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <CodeTitle as="h1" className="text-5xl md:text-6xl font-bold mb-6 text-balance">Resultados <span className="text-primary">2024</span></CodeTitle>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
          El año 2024 ha sido extraordinario. A lo largo de este camino, hemos aprendido, disfrutado y compartido
          conocimientos. Pero, sobre todo, hemos contribuido a la formación de futuros profesionales en áreas de alta
          demanda en el mundo actual.
        </p>
      </div>
    </section>
  )
}
