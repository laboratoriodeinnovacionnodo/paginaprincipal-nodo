import { Button } from "@/components/ui/button"
import { GraduationCap, Monitor } from "lucide-react"
import Link from "next/link"

export function CursosPreviewSection() {
  return (
    <section id="cursos" className="bg-gradient-to-b from-[#effdfe] to-sky-50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explora Nuestros <span className="text-primary">Cursos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Formación en tecnología adaptada a tu estilo de aprendizaje
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Cursos Virtuales Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-[#26a7fc]/10 p-8 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-[#26a7fc] text-white mb-6 shadow-lg shadow-blue-500/30">
                <Monitor className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Cursos Virtuales</h3>
              <p className="text-muted-foreground mb-6">
                Aprende desde cualquier lugar con nuestros cursos online en desarrollo web, diseño 3D, impresión 3D y
                más.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <GraduationCap className="h-4 w-4" />
                <span>4+ programas disponibles</span>
              </div>
              <Link href="/cursos?modalidad=virtual" className="group">
                <Button
                  variant="outline"
                  className="w-full bg-white/50 transition-colors group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer"
                >
                  Ver Cursos Virtuales
                </Button>
              </Link>
            </div>
          </div>

          {/* Cursos Presenciales Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-[#26a7fc]/10 p-8 border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-[#26a7fc] text-white mb-6 shadow-lg shadow-blue-500/30">
                <Monitor className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Cursos Presenciales</h3>
              <p className="text-muted-foreground mb-6">
                Experiencia práctica en nuestras instalaciones con robótica, bases de datos y más tecnologías
                emergentes.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <GraduationCap className="h-4 w-4" />
                <span>4+ programas disponibles</span>
              </div>
              <Link href="/cursos?modalidad=presencial" className="group">
                <Button
                  variant="outline"
                  className="w-full bg-white/50 transition-colors group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer"
                >
                  Ver Cursos Presenciales
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/cursos">
            <Button size="lg" className="text-lg px-8">
              Ver Todos los Cursos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
