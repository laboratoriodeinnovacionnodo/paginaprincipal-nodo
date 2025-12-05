import { getNoticias } from "@/lib/strapi/api"
import { NoticiasContent } from "@/components/noticias/noticias-content"

export default async function NoticiasPage() {
  const noticias = await getNoticias()

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-4">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold text-balance md:text-6xl">
              Las Novedades del <span className="text-cyan-500">Nodo</span>
            </h1>
          </div>
        </section>

        <NoticiasContent noticias={noticias} />
      </main>
    </div>
  )
}
