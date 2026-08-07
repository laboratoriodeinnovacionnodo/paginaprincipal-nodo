"use client"


import { CodeTitle } from "@/components/shared/code-title"
import { Header } from "@/components/header"
import { ResultadosHero } from "@/components/resultados/resultados-hero"
import { ResultadosCharts } from "@/components/resultados/resultados-charts"

export default function ResultadosPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <ResultadosHero />
      <ResultadosCharts />
    </main>
  )
}
