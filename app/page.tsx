import { HeroSection } from "@/components/home/hero-section"
import { CursosPreviewSection } from "@/components/home/cursos-preview-section"
import { ContactoSection } from "@/components/home/contacto-section"
import { ColorSeparator } from "@/components/color-separator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inicio - NODO",
  description:
    "Descubre el futuro de la educación tecnológica en NODO. Ofrecemos cursos innovadores en programación, inteligencia artificial y desarrollo de software.",
  openGraph: {
    title: "NODO - Centro de Innovación y Desarrollo Tecnológico",
    description:
      "Descubre el futuro de la educación tecnológica. Cursos innovadores en programación, IA y desarrollo de software.",
    url: "https://nodo.edu.ar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NODO - Centro de Innovación Tecnológica",
      },
    ],
  },
}

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <HeroSection />
      <ColorSeparator colors="w-full h-20 sm:h-20 md:h-20 bg-gradient-to-b from-blue-300 to-sky-50 to-[#effdfe]" />
      <CursosPreviewSection />
      <ContactoSection />
    </main>
  )
}
