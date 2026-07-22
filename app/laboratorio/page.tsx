import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Box, Cpu, Code2, ArrowRight, FlaskConical } from "lucide-react"
import { getProjects } from "@/lib/laboratorio/api"

const AREAS = [
  { key: "DISENO_3D", label: "Diseño 3D", icon: Box, color: "#0EA5E9" },
  { key: "HARDWARE", label: "Hardware", icon: Cpu, color: "#7C3AED" },
  { key: "SOFTWARE", label: "Software", icon: Code2, color: "#059669" },
] as const

export default async function LaboratorioPage() {
  const projects = await getProjects()
  const destacados = projects.filter((p) => p.featured).slice(0, 4)

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Hero */}
      <section className="container mx-auto px-4 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-cyan-100 border border-cyan-200 rounded-full px-4 py-1.5 text-sm font-semibold text-cyan-700 mb-6">
          <FlaskConical className="h-3.5 w-3.5" />
          Laboratorio de Innovación
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 text-balance">
          Donde se prueban las <span className="text-[#0EA5E9]">ideas del Nodo</span>
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed mb-10 text-pretty">
          Diseño 3D, hardware y software: conocé los proyectos que salen del laboratorio antes de
          llegar a la ciudad.
        </p>

        <Button
          asChild
          size="lg"
          className="text-white gap-2"
          style={{ backgroundImage: "linear-gradient(to right, #0EA5E9, #0284C7)" }}
        >
          <Link href="/laboratorio/proyectos">
            Ver proyectos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Áreas */}
      <section className="container mx-auto px-4 mt-16 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {AREAS.map((a) => (
            <Link key={a.key} href={`/laboratorio/proyectos?area=${a.key}`}>
              <Card className="border-cyan-100 hover:border-cyan-300 transition-colors h-full">
                <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${a.color}1a` }}
                  >
                    <a.icon className="h-6 w-6" style={{ color: a.color }} />
                  </div>
                  <p className="font-semibold text-gray-900">{a.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      {destacados.length > 0 && (
        <section className="container mx-auto px-4 mt-16 max-w-5xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Proyectos destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {destacados.map((project) => (
              <Link key={project.id} href={`/laboratorio/proyectos/${project.slug}`}>
                <Card className="border-cyan-100 hover:border-cyan-300 transition-colors h-full overflow-hidden">
                  <div
                    className="h-24 bg-cover bg-center bg-cyan-100"
                    style={project.coverImage ? { backgroundImage: `url(${project.coverImage})` } : undefined}
                  />
                  <CardContent className="pt-3 pb-4">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">{project.title}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
