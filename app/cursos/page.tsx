import { getCursosPresenciales, getCursosVirtuales, getTodosCursos } from "@/lib/strapi/api"
import { CursosContent } from "@/components/cursos/cursos-content"

export default async function CursosPage() {
  const [todosCursos, cursosPresenciales, cursosVirtuales] = await Promise.all([
    getTodosCursos(),
    getCursosPresenciales(),
    getCursosVirtuales(),
  ])

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-balance md:text-6xl">
            Nuestros <span className="text-cyan-500">Cursos</span>
          </h1>
        </div>
      </section>

      <CursosContent
        todosCursos={todosCursos}
        cursosPresenciales={cursosPresenciales}
        cursosVirtuales={cursosVirtuales}
      />
    </main>
  )
}
