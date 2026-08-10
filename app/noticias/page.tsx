import type { Metadata } from "next"
import { CodeTitle } from "@/components/shared/code-title"
import { NoticiasContent } from "@/components/noticias/noticias-content"
import { getNoticias } from "@/lib/noticias/api"

export const metadata: Metadata = {
  title: "Noticias | Nodo Tecnológico Catamarca",
  description: "Las últimas novedades del Nodo Tecnológico de Catamarca.",
}

export default async function NoticiasPage() {
  const { items: noticias } = await getNoticias({ limit: 9 })

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyan-100 via-white to-blue-100">
      <main>
        <section className="relative overflow-hidden pt-24 pb-4">
          <div className="container mx-auto px-4 text-center">
            <CodeTitle as="h1" className="mb-6 text-4xl font-bold text-balance md:text-6xl">
              Las Novedades del{" "}
              <span className="text-[#26a7fc]">Nodo</span>
            </CodeTitle>
          </div>
        </section>

        <NoticiasContent noticias={noticias} />
      </main>
    </div>
  )
}
