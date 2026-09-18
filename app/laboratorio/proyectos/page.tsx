"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Box, Cpu, Code2, FlaskConical } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getProjects } from "@/lib/laboratorio/api"
import { useLaboratorioFilter } from "@/hooks/laboratorio/use-laboratorio-filter"
import type { Project, ProjectArea } from "@/lib/laboratorio/types"

const AREA_LABEL: Record<ProjectArea, string> = {
  DISENO_3D: "Diseño 3D",
  HARDWARE:  "Hardware",
  SOFTWARE:  "Software",
}

const AREA_COLOR: Record<ProjectArea, string> = {
  DISENO_3D: "#26a7fc",
  HARDWARE:  "#7C3AED",
  SOFTWARE:  "#059669",
}

const AREAS = [
  { key: "TODOS",    label: "Todos",     icon: null },
  { key: "DISENO_3D",label: "Diseño 3D", icon: Box },
  { key: "HARDWARE", label: "Hardware",  icon: Cpu },
  { key: "SOFTWARE", label: "Software",  icon: Code2 },
] as const

function AreaBadge({ area }: { area: ProjectArea }) {
  return (
    <span
      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
      style={{
        backgroundColor: `${AREA_COLOR[area]}15`,
        color: AREA_COLOR[area],
      }}
    >
      {AREA_LABEL[area]}
    </span>
  )
}

export default function LaboratorioProyectosPage() {
  const { areaActiva, setAreaActiva } = useLaboratorioFilter()
  const [projects, setProjects]       = useState<Project[] | null>(null)

  useEffect(() => {
    let active = true
    const areaParam = areaActiva === "TODOS" ? undefined : areaActiva
    getProjects(areaParam).then((data) => {
      if (active) setProjects(data)
    })
    return () => { active = false }
  }, [areaActiva])

  return (
    <main className="min-h-screen pt-32 pb-24 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-5xl">

        <Link
          href="/laboratorio"
          className="inline-flex items-center gap-1.5 text-sm text-[#1c8fe0] hover:text-[#26a7fc] mb-8 transition-colors"
          aria-label="Volver al Laboratorio"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Laboratorio
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-balance leading-tight">
            Proyectos del laboratorio
          </h1>
          <p className="text-slate-500 text-base">
            Lo que construimos en diseño 3D, hardware y software.
          </p>
        </header>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filtrar por área">
          {AREAS.map((a) => {
            const isActive = areaActiva === a.key
            const Icon = a.icon
            return (
              <button
                key={a.key}
                onClick={() => setAreaActiva(a.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold
                            transition-all duration-200 ${
                              isActive
                                ? "bg-[#26a7fc] text-white shadow-md shadow-[#26a7fc]/25"
                                : "bg-white text-slate-600 border border-slate-200 hover:border-[#26a7fc]/30 hover:bg-[#26a7fc]/5"
                            }`}
                aria-pressed={isActive}
              >
                {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                {a.label}
              </button>
            )
          })}
        </div>

        {/* Skeletons */}
        {!projects && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {projects && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center
                          bg-white/80 border border-slate-200 rounded-2xl">
            <div className="h-16 w-16 rounded-2xl bg-[#26a7fc]/8 flex items-center justify-center mb-5">
              <FlaskConical className="h-8 w-8 text-[#26a7fc]/40" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold text-slate-700 mb-2">Sin proyectos en esta área</h2>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Todavía no hay proyectos publicados acá. Volvé pronto.
            </p>
          </div>
        )}

        {/* Grid de proyectos */}
        {projects && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {projects.map((project) => (
              <Link key={project.id} href={`/laboratorio/proyectos/${project.slug}`}>
                <article
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden
                             transition-all duration-200 ease-out h-full flex flex-col
                             hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(38,167,252,0.10)]
                             hover:border-[#26a7fc]/30"
                  aria-label={`Proyecto: ${project.title}`}
                >
                  {/* Cover */}
                  <div
                    className="h-36 bg-cover bg-center shrink-0 transition-transform duration-300 group-hover:scale-[1.02]"
                    style={
                      project.coverImage
                        ? { backgroundImage: `url(${project.coverImage})` }
                        : { background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)" }
                    }
                    role="img"
                    aria-label={project.coverImage ? project.title : "Imagen de proyecto"}
                  />
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <AreaBadge area={project.area} />
                    <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#26a7fc] transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
                      {project.description}
                    </p>
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
