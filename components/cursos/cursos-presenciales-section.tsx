import { CourseCard } from "./course-card"
import { Database, Bot } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CursosPresencialesSection() {
  return (
    <section id="cursos-presenciales" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Cursos <span className="text-primary">Presenciales</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experiencia práctica y aprendizaje colaborativo en nuestras instalaciones
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <CourseCard
            icon={<Database className="h-6 w-6" />}
            title="BASE DE DATOS"
            description="Este programa permite que los alumnos aprendan a diseñar, crear y gestionar bases de datos relacionales utilizando SQL, comprender administración de funciones agregadas, criterios de validez."
            duration="Duración: 8 clases"
            level="Edades: 16-65"
            format="Presencial"
            link="/cursos/base-datos"
          />

          <CourseCard
            icon={<Bot className="h-6 w-6" />}
            title="ROBÓTICA I - KIDS"
            description="El programa se centra en introducir a los niños en el fascinante mundo de la robótica de una manera lúdica, creativa y educativa. Ensamblado y programación mecánica, trabajo y potencia."
            duration="Edad: 5 a 12 años"
            level="Duración: 8 clases"
            format="Presencial"
            link="/cursos/robotica-kids"
          />

          <CourseCard
            icon={<Bot className="h-6 w-6" />}
            title="ROBÓTICA I - TEENS"
            description="El programa se centra en introducir a adolescentes al desarrollo de la robótica. Utilización de sensores y componentes, programación, armar y desarmar robots, solución de problemas."
            duration="Edad: 12 a 16 años"
            level="Duración: 8 clases"
            format="Presencial"
            link="/cursos/robotica-teens"
          />

          <CourseCard
            icon={<Bot className="h-6 w-6" />}
            title="ROBÓTICA II"
            description="Dirigido a aquellos que ya tienen algún tipo de conocimiento y desean avanzar en sus habilidades en el campo. Utilización de mecanismos, electrónica y programación, diseño, montaje, visión, campo, diseño y programación."
            duration="Edad: 12 a 20 años"
            level="Duración: 8 clases"
            format="Presencial"
            link="/cursos/robotica-2"
          />
        </div>

        <div className="text-center mt-10">
          
        </div>
      </div>
    </section>
  )
}
