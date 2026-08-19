// app/catamarcaopen/proyectos/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Plus, ExternalLink, Github } from "lucide-react"
import { toast } from "sonner"
import { getReposPublicos } from "@/lib/catamarcaopen/api"
import type { CatamarcaOpenRepo } from "@/lib/catamarcaopen/types"
import { AlertaTematica } from "@/components/catamarcaopen/alerta-tematica"

function RepoSkeleton() {
  return (
    <Card className="border-[#26a7fc]/10">
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/3" />
      </CardContent>
    </Card>
  )
}

function RepoCard({ repo }: { repo: CatamarcaOpenRepo }) {
  const githubUser = repo.url.replace("https://github.com/", "").split("/")[0]
  const repoSlug   = repo.url.replace("https://github.com/", "").split("/")[1] ?? ""

  return (
    <Link href={`/catamarcaopen/proyectos/${repo.id}`}>
      <Card className="h-full border-[#26a7fc]/10 hover:border-[#26a7fc]/40 transition-colors cursor-pointer">
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Github className="h-4 w-4 text-gray-500 shrink-0" strokeWidth={1.5} />
              <span className="font-semibold text-gray-900 text-sm truncate">{repo.nombre}</span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" strokeWidth={1.5} />
          </div>
          {repo.descripcion && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {repo.descripcion}
            </p>
          )}
          <p className="text-[10px] text-slate-400 font-mono truncate">
            {githubUser}/{repoSlug}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function CatamarcaOpenProyectosPage() {
  const [repos, setRepos]         = useState<CatamarcaOpenRepo[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    getReposPublicos()
      .then((data) => { if (active) setRepos(data) })
      .catch((err) => {
        if (!active) return
        toast.error((err as { message?: string })?.message ?? "Error al cargar proyectos")
      })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href="/catamarcaopen"
          className="inline-flex items-center gap-1.5 text-sm text-[#1c8fe0] hover:text-cyan-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          CatamarcaOpen
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-balance">
              Proyectos de la comunidad
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl text-pretty">
              Repositorios de código abierto publicados por vecinos y colaboradores del Nodo.
            </p>
          </div>

          <AlertaTematica destino="/catamarcaopen/proyectos/nuevo" labelConfirmar="Publicar proyecto">
            <Button
              className="text-white shrink-0 gap-2 cursor-pointer"
              style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Publicar proyecto
            </Button>
          </AlertaTematica>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <RepoSkeleton key={i} />
            ))}
          </div>
        ) : !repos || repos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[#26a7fc]/10 flex items-center justify-center">
              <Github className="h-8 w-8 text-[#26a7fc]" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Todavía no hay proyectos publicados. ¡Sé el primero en compartir tu repositorio!
            </p>
            <AlertaTematica destino="/catamarcaopen/proyectos/nuevo" labelConfirmar="Publicar proyecto">
              <Button
                className="text-white gap-2 cursor-pointer"
                style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} />
                Publicar proyecto
              </Button>
            </AlertaTematica>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
