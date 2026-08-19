#!/usr/bin/env bash
# ============================================================
#  v1-alerta-tematica.sh
#  Agrega el modal de temática (medioambiente / educación /
#  tecnología) en CatamarcaOpen — ciudadano-front (Next 16 / TS)
#
#  Ejecutar desde la raíz del repo:
#    bash v1-alerta-tematica.sh
# ============================================================
set -euo pipefail

RESET='\033[0m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; RED='\033[0;31m'
log()  { echo -e "${CYAN}[v1]${RESET} $*"; }
ok()   { echo -e "${GREEN}[ok]${RESET} $*"; }
err()  { echo -e "${RED}[!!]${RESET} $*" >&2; exit 1; }

# ── Verificar que estamos en la raíz del proyecto ────────────
[[ -f "package.json" ]] || err "Ejecutá este script desde la raíz del repo."

# ── 1. Crear directorio del componente ───────────────────────
log "Creando components/catamarcaopen/ ..."
mkdir -p components/catamarcaopen

# ── 2. Componente AlertaTematica ─────────────────────────────
log "Escribiendo components/catamarcaopen/alerta-tematica.tsx ..."
cat > components/catamarcaopen/alerta-tematica.tsx << 'COMPONENT'
"use client"

// components/catamarcaopen/alerta-tematica.tsx
// Modal informativo que se muestra antes de navegar a "Ver proyectos" o "Publicar proyecto".
// Solo es una maqueta — no bloquea el flujo real, cierra y navega al confirmar.

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Leaf, GraduationCap, Cpu } from "lucide-react"

const CATEGORIAS = [
  {
    icon: Leaf,
    label: "Medioambiente",
    color: "#22c55e",
    bg: "#22c55e1a",
    ejemplos: "reciclaje, energía solar, monitoreo ambiental…",
  },
  {
    icon: GraduationCap,
    label: "Educación",
    color: "#f59e0b",
    bg: "#f59e0b1a",
    ejemplos: "plataformas de aprendizaje, acceso educativo…",
  },
  {
    icon: Cpu,
    label: "Tecnología",
    color: "#26a7fc",
    bg: "#26a7fc1a",
    ejemplos: "software cívico, infraestructura digital…",
  },
]

interface AlertaTematicaProps {
  destino: string
  labelConfirmar?: string
  children: React.ReactNode
}

export function AlertaTematica({
  destino,
  labelConfirmar = "Entendido, continuar",
  children,
}: AlertaTematicaProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  function handleConfirm() {
    setOpen(false)
    router.push(destino)
  }

  return (
    <>
      <span
        onClick={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
        className="contents"
      >
        {children}
      </span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden gap-0">
          <div
            className="px-6 pt-7 pb-5"
            style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)" }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 leading-snug text-balance">
                ¿Tu proyecto está orientado a alguna de estas áreas?
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-muted-foreground text-pretty">
                CatamarcaOpen prioriza repositorios con impacto en la comunidad.
                Los proyectos deben estar enfocados en al menos una de las
                siguientes temáticas:
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-5 space-y-3">
            {CATEGORIAS.map(({ icon: Icon, label, color, bg, ejemplos }) => (
              <div
                key={label}
                className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ backgroundColor: bg }}
              >
                <div
                  className="mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}33` }}
                >
                  <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ejemplos}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 pb-6 flex flex-col gap-2">
            <Button
              onClick={handleConfirm}
              className="w-full text-white rounded-xl"
              style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
            >
              {labelConfirmar}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full text-muted-foreground rounded-xl text-sm"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
COMPONENT
ok "alerta-tematica.tsx creado"

# ── 3. Landing page de CatamarcaOpen ─────────────────────────
log "Sobreescribiendo app/catamarcaopen/page.tsx ..."
cat > app/catamarcaopen/page.tsx << 'LANDING'
"use client"

// app/catamarcaopen/page.tsx
import { CodeTitle } from "@/components/shared/code-title"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, ShieldCheck, GitMerge, ArrowRight } from "lucide-react"
import { AlertaTematica } from "@/components/catamarcaopen/alerta-tematica"

const features = [
  {
    icon: Code2,
    title: "Código abierto",
    description:
      "Todos los proyectos municipales son públicos y auditables. Cualquier ciudadano puede ver, clonar y contribuir al código fuente de los sistemas del Nodo.",
  },
  {
    icon: ShieldCheck,
    title: "Revisión por pares",
    description:
      "Los proyectos pasan por un proceso de revisión técnica con calificaciones y comentarios de colaboradores verificados.",
  },
  {
    icon: GitMerge,
    title: "Contribución ciudadana",
    description:
      "Cualquier vecino puede proponer mejoras, reportar problemas o enviar nuevos proyectos que beneficien a la comunidad catamarqueña.",
  },
]

export default function CatamarcaOpenLandingPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Hero */}
      <section className="container mx-auto px-4 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-[#26a7fc]/10 border border-[#26a7fc]/20 rounded-full px-4 py-1.5 text-sm font-semibold text-[#1c8fe0] mb-6">
          <Code2 className="h-3.5 w-3.5" />
          Plataforma Open Source Municipal
        </div>

        <CodeTitle as="h1" className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 text-balance">
          Catamarca<span className="text-[#26a7fc]">Open</span>
        </CodeTitle>

        <p className="text-lg text-muted-foreground leading-relaxed mb-10 text-pretty">
          Explorá, colaborá y revisá proyectos de código abierto que mejoran los servicios digitales
          de la ciudad. La tecnología del Nodo, al servicio de la ciudadanía.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <AlertaTematica destino="/catamarcaopen/proyectos" labelConfirmar="Ver proyectos">
            <Button
              size="lg"
              className="text-white gap-2 cursor-pointer"
              style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
            >
              Ver proyectos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </AlertaTematica>

          <AlertaTematica destino="/catamarcaopen/proyectos/nuevo" labelConfirmar="Publicar proyecto">
            <Button size="lg" variant="outline" className="cursor-pointer">
              Publicar un proyecto
            </Button>
          </AlertaTematica>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 mt-20 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-balance">
            ¿Por qué CatamarcaOpen?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
            Una plataforma pensada para fomentar la transparencia, la colaboración y la innovación
            cívica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-[#26a7fc]/10 hover:border-[#26a7fc]/30 transition-colors">
              <CardContent className="pt-6 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#26a7fc]/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-[#26a7fc]" />
                </div>
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="container mx-auto px-4 mt-20 max-w-2xl text-center">
        <Card className="border-[#26a7fc]/10 bg-white/70">
          <CardContent className="pt-10 pb-10 flex flex-col items-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-balance">
              Sumate a la comunidad open source de Catamarca
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md text-pretty">
              Explorá proyectos, dejá tu revisión o proponé el tuyo con tu misma cuenta de Google del
              Nodo.
            </p>
            <AlertaTematica destino="/catamarcaopen/proyectos" labelConfirmar="Ver proyectos">
              <Button
                size="lg"
                className="text-white gap-2 cursor-pointer"
                style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
              >
                Ver proyectos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </AlertaTematica>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
LANDING
ok "app/catamarcaopen/page.tsx actualizado"

# ── 4. Listado de proyectos ───────────────────────────────────
log "Sobreescribiendo app/catamarcaopen/proyectos/page.tsx ..."
cat > app/catamarcaopen/proyectos/page.tsx << 'PROYECTOS'
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
PROYECTOS
ok "app/catamarcaopen/proyectos/page.tsx actualizado"

# ── 5. Resumen ────────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════${RESET}"
echo -e "${GREEN}  ✅  v1-alerta-tematica — LISTO        ${RESET}"
echo -e "${GREEN}════════════════════════════════════════${RESET}"
echo ""
echo "  Archivos creados / modificados:"
echo "    + components/catamarcaopen/alerta-tematica.tsx  (nuevo)"
echo "    ~ app/catamarcaopen/page.tsx                    (modificado)"
echo "    ~ app/catamarcaopen/proyectos/page.tsx          (modificado)"
echo ""
echo "  Verificá con:  pnpm build"
echo ""