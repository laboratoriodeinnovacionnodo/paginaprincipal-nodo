import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getProjectBySlug } from "@/lib/laboratorio/api"
import type { ProjectArea } from "@/lib/laboratorio/types"

const AREA_LABEL: Record<ProjectArea, string> = {
  DISENO_3D: "Diseño 3D",
  HARDWARE: "Hardware",
  SOFTWARE: "Software",
}

export default async function LaboratorioProyectoDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          href="/laboratorio/proyectos"
          className="inline-flex items-center gap-1.5 text-sm text-cyan-700 hover:text-cyan-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Link>

        {project.coverImage && (
          <div
            className="h-56 w-full rounded-xl bg-cover bg-center bg-cyan-100 mb-6"
            style={{ backgroundImage: `url(${project.coverImage})` }}
          />
        )}

        <span className="inline-block text-[10px] font-medium px-2 py-1 rounded-full bg-cyan-100 text-cyan-700 mb-3">
          {AREA_LABEL[project.area]}
        </span>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-balance">{project.title}</h1>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-700 leading-relaxed mb-8 text-pretty">{project.description}</p>

        {project.content && (
          <div className="prose prose-sm max-w-none text-gray-700 mb-8" dangerouslySetInnerHTML={{ __html: project.content }} />
        )}

        {project.images.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Galería</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {project.images.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square rounded-lg bg-cover bg-center bg-cyan-100"
                  style={{ backgroundImage: `url(${image.url})` }}
                  role="img"
                  aria-label={image.alt ?? project.title}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
