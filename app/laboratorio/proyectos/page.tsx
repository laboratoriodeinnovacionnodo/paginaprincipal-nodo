"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Box, Cpu, Code2 } from "lucide-react"
import { getProjects } from "@/lib/laboratorio/api"
import { useLaboratorioFilter, type AreaFiltro } from "@/hooks/laboratorio/use-laboratorio-filter"
import type { Project, ProjectArea } from "@/lib/laboratorio/types"

const AREAS: { key: AreaFiltro; label: string; icon?: typeof Box }[] = [
  { key: "TODOS", label: "Todos" },
  { key: "DISENO_3D", label: "Diseño 3D", icon: Box },
  { key: "HARDWARE", label: "Hardware", icon: Cpu },
  { key: "SOFTWARE", label: "Software", icon: Code2 },
]

const AREA_LABEL: Record<ProjectArea, string> = {
  DISENO_3D: "Diseño 3D",
  HARDWARE: "Hardware",
  SOFTWARE: "Software",
}

function AreaBadge({ area }: { area: ProjectArea }) {
  return (
    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-cyan-100 text-cyan-700">
      {AREA_LABEL[area]}
    </span>
  )
}

export default function LaboratorioProyectosPage() {
  const { areaActiva, setAreaActiva } = useLaboratorioFilter()
  const [projects, setProjects] = useState<Project[] | null>(null)

  useEffect(() => {
    let active = true
    const areaParam = areaActiva === "TODOS" ? undefined : areaActiva
    getProjects(areaParam).then((data) => {
      if (active) setProjects(data)
    })
    return () => {
      active = false
    }
  }, [areaActiva])

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href="/laboratorio"
          className="inline-flex items-center gap-1.5 text-sm text-cyan-700 hover:text-cyan-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Laboratorio
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-balance">
          Proyectos del laboratorio
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {AREAS.map((a) => {
            const isActive = areaActiva === a.key
            return (
              <button
                key={a.key}
                onClick={() => setAreaActiva(a.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  isActive ? "bg-cyan-500 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-cyan-50"
                }`}
              >
                {a.icon ? <a.icon className="h-3.5 w-3.5" /> : null}
                {a.label}
              </button>
            )
          })}
        </div>

        {!projects ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            Todavía no hay proyectos publicados en esta área.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {projects.map((project) => (
              <Link key={project.id} href={`/laboratorio/proyectos/${project.slug}`}>
                <Card className="h-full border-cyan-100 hover:border-cyan-300 transition-colors overflow-hidden">
                  <div
                    className="h-32 bg-cover bg-center bg-cyan-100"
                    style={project.coverImage ? { backgroundImage: `url(${project.coverImage})` } : undefined}
                  />
                  <CardContent className="pt-4 flex flex-col gap-2">
                    <AreaBadge area={project.area} />
                    <h3 className="font-semibold text-gray-900 leading-snug">{project.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
