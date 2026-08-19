"use client"

// app/catamarcaopen/page.tsx
import { CodeTitle } from "@/components/shared/code-title"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, ShieldCheck, GitMerge, ArrowRight } from "lucide-react"
import { AlertaTematica } from "@/components/catamarcaopen/alerta-tematica"

const features = [
  {
    icon: Code2,
    title: "Código abierto",
    description:
      "Todos los proyectos municipales son públicos y auditables. Cualquier ciudadano puede ver, clonar y contribuir al código fuente de los sistemas del Nodo.",
  },
  {
    icon: ShieldCheck,
    title: "Revisión por pares",
    description:
      "Los proyectos pasan por un proceso de revisión técnica con calificaciones y comentarios de colaboradores verificados.",
  },
  {
    icon: GitMerge,
    title: "Contribución ciudadana",
    description:
      "Cualquier vecino puede proponer mejoras, reportar problemas o enviar nuevos proyectos que beneficien a la comunidad catamarqueña.",
  },
]

export default function CatamarcaOpenLandingPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Hero */}
      <section className="container mx-auto px-4 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-[#26a7fc]/10 border border-[#26a7fc]/20 rounded-full px-4 py-1.5 text-sm font-semibold text-[#1c8fe0] mb-6">
          <Code2 className="h-3.5 w-3.5" />
          Plataforma Open Source Municipal
        </div>

        <CodeTitle as="h1" className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 text-balance">
          Catamarca<span className="text-[#26a7fc]">Open</span>
        </CodeTitle>

        <p className="text-lg text-muted-foreground leading-relaxed mb-10 text-pretty">
          Explorá, colaborá y revisá proyectos de código abierto que mejoran los servicios digitales
          de la ciudad. La tecnología del Nodo, al servicio de la ciudadanía.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <AlertaTematica destino="/catamarcaopen/proyectos" labelConfirmar="Ver proyectos">
            <Button
              size="lg"
              className="text-white gap-2 cursor-pointer"
              style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
            >
              Ver proyectos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </AlertaTematica>

          <AlertaTematica destino="/catamarcaopen/proyectos/nuevo" labelConfirmar="Publicar proyecto">
            <Button size="lg" variant="outline" className="cursor-pointer">
              Publicar un proyecto
            </Button>
          </AlertaTematica>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 mt-20 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-balance">
            ¿Por qué CatamarcaOpen?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
            Una plataforma pensada para fomentar la transparencia, la colaboración y la innovación
            cívica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-[#26a7fc]/10 hover:border-[#26a7fc]/30 transition-colors">
              <CardContent className="pt-6 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#26a7fc]/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-[#26a7fc]" />
                </div>
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="container mx-auto px-4 mt-20 max-w-2xl text-center">
        <Card className="border-[#26a7fc]/10 bg-white/70">
          <CardContent className="pt-10 pb-10 flex flex-col items-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-balance">
              Sumate a la comunidad open source de Catamarca
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md text-pretty">
              Explorá proyectos, dejá tu revisión o proponé el tuyo con tu misma cuenta de Google del
              Nodo.
            </p>
            <AlertaTematica destino="/catamarcaopen/proyectos" labelConfirmar="Ver proyectos">
              <Button
                size="lg"
                className="text-white gap-2 cursor-pointer"
                style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
              >
                Ver proyectos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </AlertaTematica>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
