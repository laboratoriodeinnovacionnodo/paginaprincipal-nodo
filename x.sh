#!/usr/bin/env bash
# =============================================================================
# ciudadano-front — Fix build: app/catamarcaopen/proyectos/[id]/page.tsx
#
# La página de detalle usaba getProjectById y getProjectReviews del mock.
# Esas funciones ya no existen en el api.ts actualizado.
# Este fix reescribe la página para usar getReposPublicos + filtro por id.
#
# CORRER PARADO EN LA RAÍZ DE ciudadano-front
# =============================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${BLUE}[fix]${NC} $1"; }
ok()   { echo -e "${GREEN}✔${NC}  $1"; }
sep()  { echo -e "\n${GREEN}────────────────────────────────────────────────${NC}"; }

sep
echo -e "${GREEN}Fix — app/catamarcaopen/proyectos/[id]/page.tsx${NC}"
sep

[[ -f "package.json" ]] || { echo "Ejecutar desde la raíz de ciudadano-front"; exit 1; }

mkdir -p "app/catamarcaopen/proyectos/[id]"

log "Reescribiendo app/catamarcaopen/proyectos/[id]/page.tsx..."
cat > "app/catamarcaopen/proyectos/[id]/page.tsx" << 'EOF'
// app/catamarcaopen/proyectos/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft, ExternalLink, Github,
  GitBranch, Calendar, Globe, Lock,
} from "lucide-react"
import { toast } from "sonner"
import { getReposPublicos } from "@/lib/catamarcaopen/api"
import type { CatamarcaOpenRepo } from "@/lib/catamarcaopen/types"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    year: "numeric", month: "long", day: "numeric",
  })
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-3 mt-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

export default function CatamarcaOpenRepoDetailPage() {
  const params   = useParams<{ id: string }>()
  const [repo, setRepo]       = useState<CatamarcaOpenRepo | null | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    setIsLoading(true)

    getReposPublicos()
      .then((repos) => {
        if (!active) return
        const found = repos.find((r) => r.id === params.id) ?? null
        setRepo(found)
      })
      .catch((err: unknown) => {
        if (!active) return
        toast.error((err as { message?: string })?.message ?? "Error al cargar el proyecto")
        setRepo(null)
      })
      .finally(() => { if (active) setIsLoading(false) })

    return () => { active = false }
  }, [params.id])

  const githubParts = repo?.url.replace("https://github.com/", "").split("/") ?? []
  const githubUser  = githubParts[0] ?? ""
  const githubRepo  = githubParts[1] ?? ""

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          href="/catamarcaopen/proyectos"
          className="inline-flex items-center gap-1.5 text-sm text-[#1c8fe0] hover:text-cyan-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Todos los proyectos
        </Link>

        {isLoading ? (
          <DetailSkeleton />
        ) : repo === null ? (
          // Repo no encontrado
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Github className="h-10 w-10 text-slate-300 mb-4" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-600 mb-1">Proyecto no encontrado</p>
            <p className="text-xs text-slate-400 mb-6">
              Es posible que haya sido eliminado o no sea público.
            </p>
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/catamarcaopen/proyectos">Ver todos los proyectos</Link>
            </Button>
          </div>
        ) : (
          <Card className="border-[#26a7fc]/10">
            <CardContent className="pt-7 pb-8 px-6 space-y-6">

              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-[#26a7fc]/10 flex items-center justify-center shrink-0">
                    <Github className="h-5 w-5 text-[#26a7fc]" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl font-bold text-slate-900 truncate">{repo.nombre}</h1>
                    <p className="text-xs font-mono text-slate-400 truncate">
                      {githubUser}/{githubRepo}
                    </p>
                  </div>
                </div>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button
                    size="sm"
                    className="text-white gap-2 rounded-xl"
                    style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Ver en GitHub
                  </Button>
                </a>
              </div>

              {/* Descripción */}
              {repo.descripcion && (
                <p className="text-sm text-slate-600 leading-relaxed">{repo.descripcion}</p>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
                  <GitBranch className="h-4 w-4 text-slate-400 shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Rama</p>
                    <p className="text-xs font-mono text-slate-700 truncate">{repo.rama}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
                  {repo.publico
                    ? <Globe className="h-4 w-4 text-green-500 shrink-0" strokeWidth={1.5} />
                    : <Lock  className="h-4 w-4 text-amber-500 shrink-0" strokeWidth={1.5} />}
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Visibilidad</p>
                    <p className="text-xs text-slate-700">{repo.publico ? "Público" : "Privado"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Publicado</p>
                    <p className="text-xs text-slate-700">{formatDate(repo.createdAt)}</p>
                  </div>
                </div>

                {repo.ciudadano && (
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
                    <div className="h-5 w-5 rounded-full bg-[#26a7fc]/20 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-[#26a7fc]">
                        {repo.ciudadano.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Autor</p>
                      <p className="text-xs text-slate-700 truncate">{repo.ciudadano.name}</p>
                    </div>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
EOF
ok "app/catamarcaopen/proyectos/[id]/page.tsx reescrita"

sep
echo -e "${GREEN}✅  Fix aplicado${NC}"
echo ""
echo -e "  La página de detalle ahora:"
echo -e "  - Usa ${YELLOW}getReposPublicos()${NC} + filtro por id (sin endpoint extra)"
echo -e "  - Muestra: nombre, URL GitHub, descripción, rama, visibilidad, fecha, autor"
echo -e "  - Estado vacío si el repo no existe o no es público"
sep