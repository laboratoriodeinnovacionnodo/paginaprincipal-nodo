import type { Metadata }    from "next"
import { CodeTitle }        from "@/components/shared/code-title"
import { NoticiasContent }  from "@/components/noticias/noticias-content"
import { getNoticias }      from "@/lib/noticias/api"
import { Newspaper }        from "lucide-react"
import { MatrixBackground } from "@/components/shared/matrix-background"

export const metadata: Metadata = {
  title:       "Noticias | Nodo Tecnológico Catamarca",
  description: "Las últimas novedades, noticias y actualizaciones del Nodo Tecnológico de Catamarca.",
  openGraph: {
    title:       "Noticias | Nodo Tecnológico Catamarca",
    description: "Las últimas novedades del Nodo Tecnológico.",
    images: [{ url: "/og-noticias.jpg", width: 1200, height: 630, alt: "Noticias — Nodo Tecnológico" }],
  },
}

export const revalidate = 60

export default async function NoticiasPage() {
  const { items: noticias } = await getNoticias({ limit: 100 })

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">

      {/* ── MatrixBackground — cubre toda la página ───────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <MatrixBackground
          opacity={0.9}
          colorHead="#26a7fc"
          colorTrail="#94a3b8"
          fontSize={13}
          speed={0.22}
          headOpacity={0.65}
          trailOpacity={0.16}
          trailLength={5}
        />
      </div>

      {/* Contenido sobre el canvas */}
      <main className="relative z-10">

        {/* ── Hero centrado ─────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-12 overflow-hidden">

          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#26a7fc]/6 blur-3xl" />
            <div className="absolute top-20 -left-24 w-72 h-72 rounded-full bg-cyan-200/25 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">

            <div className="inline-flex items-center gap-2 bg-[#26a7fc]/8 border border-[#26a7fc]/20
                            rounded-full px-4 py-1.5 text-xs font-semibold text-[#1c8fe0] mb-6">
              <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
              Novedades del Nodo
            </div>

            <CodeTitle
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 text-balance
                         leading-[1.05] tracking-tight mb-5"
              immediate
            >
              Las novedades del{" "}
              <span className="text-[#26a7fc]">Nodo</span>
            </CodeTitle>

            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto mb-8">
              Noticias, actualizaciones y todo lo que pasa en el centro
              tecnológico de Catamarca.
            </p>

            {noticias.length > 0 && (
              <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur-sm
                              border border-slate-200 rounded-full px-5 py-2 shadow-sm
                              text-sm text-slate-500">
                <span className="font-bold text-[#26a7fc] text-base">{noticias.length}</span>
                {noticias.length === 1 ? "noticia publicada" : "noticias publicadas"}
              </div>
            )}
          </div>
        </section>

        <NoticiasContent noticias={noticias} />

      </main>
    </div>
  )
}
