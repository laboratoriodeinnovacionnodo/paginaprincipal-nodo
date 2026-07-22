import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, ShieldCheck, GitMerge, ArrowRight } from "lucide-react"

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
        <div className="inline-flex items-center gap-2 bg-cyan-100 border border-cyan-200 rounded-full px-4 py-1.5 text-sm font-semibold text-cyan-700 mb-6">
          <Code2 className="h-3.5 w-3.5" />
          Plataforma Open Source Municipal
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 text-balance">
          Catamarca<span className="text-[#0EA5E9]">Open</span>
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed mb-10 text-pretty">
          Explorá, colaborá y revisá proyectos de código abierto que mejoran los servicios digitales
          de la ciudad. La tecnología del Nodo, al servicio de la ciudadanía.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="text-white gap-2"
            style={{ backgroundImage: "linear-gradient(to right, #0EA5E9, #0284C7)" }}
          >
            <Link href="/catamarcaopen/proyectos">
              Ver proyectos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/catamarcaopen/proyectos/nuevo">Publicar un proyecto</Link>
          </Button>
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
            <Card key={feature.title} className="border-cyan-100 hover:border-cyan-300 transition-colors">
              <CardContent className="pt-6 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-cyan-600" />
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
        <Card className="border-cyan-100 bg-white/70">
          <CardContent className="pt-10 pb-10 flex flex-col items-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-balance">
              Sumate a la comunidad open source de Catamarca
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md text-pretty">
              Explorá proyectos, dejá tu revisión o proponé el tuyo con tu misma cuenta de Google del
              Nodo.
            </p>
            <Button
              asChild
              size="lg"
              className="text-white gap-2"
              style={{ backgroundImage: "linear-gradient(to right, #0EA5E9, #0284C7)" }}
            >
              <Link href="/catamarcaopen/proyectos">
                Ver proyectos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
