"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ExternalLink, Star, Github } from "lucide-react"
import { getProjectById, getProjectReviews } from "@/lib/catamarcaopen/api"
import type { Project, Review } from "@/lib/catamarcaopen/types"

const STATUS_MAP = {
  aprobado: { label: "Aprobado", className: "bg-green-100 text-green-800" },
  en_revision: { label: "En revisión", className: "bg-amber-100 text-amber-800" },
  rechazado: { label: "Rechazado", className: "bg-red-100 text-red-800" },
} as const

function StatusBadge({ status }: { status: Project["status"] }) {
  const { label, className } = STATUS_MAP[status]
  return <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${className}`}>{label}</span>
}

function Stars({ rating, size = "h-3.5 w-3.5" }: { rating: number; size?: string }) {
  const full = Math.round(rating)
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${size} ${i < full ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
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

export default function CatamarcaOpenProyectoDetailPage() {
  const params = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null | undefined>(undefined)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    let active = true
    getProjectById(params.id).then((data) => {
      if (!active) return
      setProject(data)
      if (data) {
        getProjectReviews(data.id).then((r) => {
          if (active) setReviews(r)
        })
      }
    })
    return () => {
      active = false
    }
  }, [params.id])

  if (project === undefined) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
        <div className="container mx-auto px-4 max-w-2xl space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </main>
    )
  }

  if (project === null) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">No encontramos ese proyecto</p>
          <Button asChild variant="outline">
            <Link href="/catamarcaopen/proyectos">Volver al listado</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          href="/catamarcaopen/proyectos"
          className="inline-flex items-center gap-1.5 text-sm text-cyan-700 hover:text-cyan-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <StatusBadge status={project.status} />
          <span className="text-xs text-muted-foreground">{project.stack.join(" · ")}</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-balance">{project.title}</h1>

        <div className="flex items-center gap-2 mb-6">
          <div
            className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            style={{ backgroundImage: "linear-gradient(135deg, #0EA5E9, #0284C7)" }}
          >
            {initials(project.authorName)}
          </div>
          <span className="text-sm text-gray-700">{project.authorName}</span>
          <span className="text-xs text-gray-300">·</span>
          <Stars rating={project.rating} />
          <span className="text-xs text-muted-foreground">({project.reviewsCount})</span>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-6 text-pretty">{project.description}</p>

        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-800 mb-8"
        >
          <Github className="h-4 w-4" />
          Ver repositorio
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        <Card className="border-cyan-100">
          <CardContent className="pt-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Revisiones ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-xs text-muted-foreground">Todavía no tiene revisiones.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <div key={review.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <div
                      className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
                      style={{ backgroundImage: "linear-gradient(135deg, #0EA5E9, #0284C7)" }}
                    >
                      {initials(review.authorName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900">{review.authorName}</span>
                        <Stars rating={review.rating} size="h-3 w-3" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
