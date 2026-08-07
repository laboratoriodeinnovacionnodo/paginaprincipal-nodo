"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Star, Plus } from "lucide-react"
import { getProjects } from "@/lib/catamarcaopen/api"
import type { Project } from "@/lib/catamarcaopen/types"

const STATUS_MAP = {
  aprobado: { label: "Aprobado", className: "bg-green-100 text-green-800" },
  en_revision: { label: "En revisión", className: "bg-amber-100 text-amber-800" },
  rechazado: { label: "Rechazado", className: "bg-red-100 text-red-800" },
} as const

function StatusBadge({ status }: { status: Project["status"] }) {
  const { label, className } = STATUS_MAP[status]
  return <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${className}`}>{label}</span>
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < full ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      ))}
    </div>
  )
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default function CatamarcaOpenProyectosPage() {
  const [projects, setProjects] = useState<Project[] | null>(null)

  useEffect(() => {
    let active = true
    getProjects().then((data) => {
      if (active) setProjects(data)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href="/catamarcaopen"
          className="inline-flex items-center gap-1.5 text-sm text-[#1c8fe0] hover:text-cyan-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          CatamarcaOpen
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-balance">
              Proyectos de la comunidad
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl text-pretty">
              Explorá los proyectos de código abierto publicados por vecinos y colaboradores del Nodo.
            </p>
          </div>
          <Button
            asChild
            className="text-white shrink-0"
            style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
          >
            <Link href="/catamarcaopen/proyectos/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Publicar proyecto
            </Link>
          </Button>
        </div>

        {!projects ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {projects.map((project) => (
              <Link key={project.id} href={`/catamarcaopen/proyectos/${project.id}`}>
                <Card className="h-full border-[#26a7fc]/10 hover:border-[#26a7fc]/30 transition-colors">
                  <CardContent className="pt-5 flex flex-col gap-3 h-full">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={project.status} />
                      <span className="text-[10px] text-muted-foreground">{project.stack.join(" · ")}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 leading-snug">{project.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <div
                        className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
                        style={{ backgroundImage: "linear-gradient(135deg, #26a7fc, #1c8fe0)" }}
                      >
                        {initials(project.authorName)}
                      </div>
                      <span className="text-xs text-gray-700">{project.authorName}</span>
                    </div>
                    <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                      <Stars rating={project.rating} />
                      <span className="text-[11px] text-muted-foreground">({project.reviewsCount})</span>
                    </div>
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
