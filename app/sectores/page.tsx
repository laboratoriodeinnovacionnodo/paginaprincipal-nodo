"use client"


import { CodeTitle } from "@/components/shared/code-title"
import { Header } from "@/components/header"
import { SectoresFisicosHero } from "@/components/sectores/sectores-fisicos-hero"
import { ClubEmprendedoresSection } from "@/components/sectores/club-emprendedores-section"
import { LaboratorioSection } from "@/components/sectores/laboratorio-section"
import { CoworkingSection } from "@/components/sectores/coworking-section"
import { PropuestasSection } from "@/components/sectores/propuestas-section"

export default function SectoresFisicosPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <SectoresFisicosHero />
      <ClubEmprendedoresSection />
      <LaboratorioSection />
      <CoworkingSection />
      <PropuestasSection />
    </main>
  )
}
