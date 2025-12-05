import { CourseCard } from "./course-card"
import { Code, Cable as Cube, Printer } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CursosVirtualesSection() {
  return (
    <section id="cursos-virtuales" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Cursos <span className="text-primary">Virtuales</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aprende desde cualquier lugar con nuestros cursos online especializados en tecnología
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <CourseCard
            icon={<Code className="h-6 w-6" />}
            title="DIPLOMATURA UNIVERSITARIA DESARROLLO WEB FULL STACK CON JAVASCRIPT"
            description="Los alumnos podrán aprender a diseñar, desarrollar y optimizar aplicaciones web modernas, trabajar con bases de datos y gestionar servidores backend."
            duration="1 Banda Web"
            level="5 Ingenierías de JavaScript"
            format="Virtual"
            link="/cursos/diplomatura-fullstack"
          />

          <CourseCard
            icon={<Code className="h-6 w-6" />}
            title="DESARROLLO WEB FULL STACK JUNIOR"
            description="El programa enseña a desarrollar con conocimiento básico en el diseño e implementación de sitios y aplicaciones web con arquitectura frontend y backend."
            duration="Edad: 8 a 20 años"
            level="Duración: 6 meses"
            format="Virtual"
            link="/cursos/fullstack-junior"
          />

          <CourseCard
            icon={<Cube className="h-6 w-6" />}
            title="DISEÑO Y MODELADO 3D EN SKETCHUP"
            description="En uno de los programas más difundidos en el mundo, fue utilizado por la arquitectura, ingeniería, diseño de interiores, de videojuegos, películas y series televisivas."
            duration="Edad: +20 años"
            level="Duración: 4 meses"
            format="Virtual"
            link="/cursos/sketchup"
          />

          <CourseCard
            icon={<Printer className="h-6 w-6" />}
            title="IMPRESIÓN 3D"
            description="Para capacitar las bases teóricas y prácticas necesarias para aplicar formatos de impresión 3D, por medio del modelado aditivo y otras técnicas de impresión."
            duration="Edad: +20 años"
            level="Duración: 1 mes"
            format="Virtual"
            link="/cursos/impresion-3d"
          />
        </div>

        <div className="text-center mt-10">
          
        </div>
      </div>
    </section>
  )
}
