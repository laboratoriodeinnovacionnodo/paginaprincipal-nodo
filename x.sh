#!/usr/bin/env bash
# =============================================================================
# ciudadano-front — CatamarcaOpen conectado a ciudadano-back v1
#
# Reemplaza el mock de catamarcaopen por llamadas reales a ciudadano-back.
# Archivos modificados:
#   - lib/catamarcaopen/types.ts          → tipos reales del back
#   - lib/catamarcaopen/api.ts            → cliente real (ciudadano-back)
#   - app/catamarcaopen/proyectos/page.tsx         → listado real
#   - app/catamarcaopen/proyectos/nuevo/page.tsx   → formulario conectado
#
# CORRER PARADO EN LA RAÍZ DE ciudadano-front
# =============================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${BLUE}[catamarcaopen-front]${NC} $1"; }
ok()   { echo -e "${GREEN}✔${NC}  $1"; }
warn() { echo -e "${YELLOW}⚠${NC}  $1"; }
sep()  { echo -e "\n${GREEN}────────────────────────────────────────────────${NC}"; }

sep
echo -e "${GREEN}ciudadano-front — CatamarcaOpen conectado a ciudadano-back v1${NC}"
sep

[[ -f "package.json" ]] || { echo "Ejecutar desde la raíz de ciudadano-front"; exit 1; }

mkdir -p lib/catamarcaopen app/catamarcaopen/proyectos/nuevo

# ─── 1. Types — shape real del back ───────────────────────────────────────────
log "Actualizando lib/catamarcaopen/types.ts..."
cat > lib/catamarcaopen/types.ts << 'EOF'
// lib/catamarcaopen/types.ts
// Shape real que devuelve ciudadano-back /api/v1/catamarcaopen

export interface CatamarcaOpenRepo {
  id:          string
  ciudadanoId: string
  url:         string
  nombre:      string
  descripcion: string | null
  proveedor:   'GITHUB'
  rama:        string
  publico:     boolean
  metadata:    Record<string, unknown>
  createdAt:   string
  updatedAt:   string
  // incluido en /publicos
  ciudadano?: {
    id:      string
    googleId: string
    name:    string
    email:   string
    picture: string | null
  }
}

export interface CreateRepoInput {
  url:         string
  nombre:      string
  descripcion?: string
  rama?:       string
  publico?:    boolean
}

export interface UpdateRepoInput {
  nombre?:      string
  descripcion?: string
  rama?:        string
  publico?:     boolean
}
EOF
ok "types.ts"

# ─── 2. API client — llamadas reales a ciudadano-back ─────────────────────────
log "Actualizando lib/catamarcaopen/api.ts..."
cat > lib/catamarcaopen/api.ts << 'EOF'
// lib/catamarcaopen/api.ts
//
// Cliente real contra ciudadano-back /api/v1/catamarcaopen
// Auth: Firebase Bearer token (mismo que el resto del ecosistema ciudadano)
//
// Variables de entorno requeridas:
//   NEXT_PUBLIC_CIUDADANO_API_URL=https://api.ciudadano.nodo.cc.gob.ar

import type {
  CatamarcaOpenRepo,
  CreateRepoInput,
  UpdateRepoInput,
} from './types'

const BASE = (process.env.NEXT_PUBLIC_CIUDADANO_API_URL ?? '').replace(/\/$/, '') + '/api/v1'

async function apiFetch<T>(
  path: string,
  idToken: string,
  options: RequestInit = {},
): Promise<T> {
  if (!BASE || BASE === '/api/v1') {
    throw new Error('[catamarcaopen-api] NEXT_PUBLIC_CIUDADANO_API_URL no está configurada')
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      ...(options.headers ?? {}),
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`[catamarcaopen-api] ${res.status} ${path} — ${body}`)
  }

  const json = await res.json()
  // ciudadano-back envuelve en { data, statusCode, timestamp }
  return (json?.data ?? json) as T
}

// ── Endpoints públicos (sin auth) ─────────────────────────────────────────────

/**
 * GET /catamarcaopen/publicos
 * Lista todos los repos públicos de la comunidad.
 * Incluye datos del ciudadano autor.
 */
export async function getReposPublicos(): Promise<CatamarcaOpenRepo[]> {
  // Sin auth: usa fetch directo con x-api-key no aplica para público
  // El back devuelve repos donde publico=true sin requerir auth
  const url = `${BASE}/catamarcaopen/publicos`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`[catamarcaopen-api] ${res.status} /publicos — ${body}`)
  }
  const json = await res.json()
  return (json?.data ?? json) as CatamarcaOpenRepo[]
}

// ── Endpoints autenticados (Firebase Bearer) ──────────────────────────────────

/**
 * GET /catamarcaopen/me
 * Mis repos registrados (ciudadano autenticado).
 */
export async function getMisRepos(idToken: string): Promise<CatamarcaOpenRepo[]> {
  return apiFetch<CatamarcaOpenRepo[]>('/catamarcaopen/me', idToken)
}

/**
 * POST /catamarcaopen
 * Registrar un repo de GitHub.
 */
export async function crearRepo(
  input: CreateRepoInput,
  idToken: string,
): Promise<CatamarcaOpenRepo> {
  return apiFetch<CatamarcaOpenRepo>('/catamarcaopen', idToken, {
    method: 'POST',
    body:   JSON.stringify(input),
  })
}

/**
 * PATCH /catamarcaopen/:id
 * Editar un repo propio.
 */
export async function editarRepo(
  id: string,
  input: UpdateRepoInput,
  idToken: string,
): Promise<CatamarcaOpenRepo> {
  return apiFetch<CatamarcaOpenRepo>(`/catamarcaopen/${id}`, idToken, {
    method: 'PATCH',
    body:   JSON.stringify(input),
  })
}

/**
 * DELETE /catamarcaopen/:id
 * Eliminar un repo propio.
 */
export async function eliminarRepo(
  id: string,
  idToken: string,
): Promise<{ id: string; deleted: boolean }> {
  return apiFetch(`/catamarcaopen/${id}`, idToken, { method: 'DELETE' })
}
EOF
ok "api.ts"

# ─── 3. Página listado — /catamarcaopen/proyectos ─────────────────────────────
log "Actualizando app/catamarcaopen/proyectos/page.tsx..."
cat > app/catamarcaopen/proyectos/page.tsx << 'EOF'
// app/catamarcaopen/proyectos/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Plus, ExternalLink, Github, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getReposPublicos } from "@/lib/catamarcaopen/api"
import type { CatamarcaOpenRepo } from "@/lib/catamarcaopen/types"

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
  const githubUser = repo.url.replace('https://github.com/', '').split('/')[0]
  const repoSlug   = repo.url.replace('https://github.com/', '').split('/')[1] ?? ''

  return (
    <Card className="border-[#26a7fc]/10 hover:border-[#26a7fc]/30 hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Github className="h-4 w-4 text-slate-400 shrink-0" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-slate-900 truncate">{repo.nombre}</h3>
          </div>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[#26a7fc] hover:text-[#1c8fe0]"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
          </a>
        </div>

        {repo.descripcion && (
          <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
            {repo.descripcion}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 mt-3">
          <span className="text-[10px] font-mono text-slate-400 truncate">
            {githubUser}/{repoSlug}
          </span>
          {repo.ciudadano && (
            <span className="text-[10px] text-slate-400 shrink-0">
              por {repo.ciudadano.name.split(' ')[0]}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function CatamarcaOpenProyectosPage() {
  const [repos, setRepos] = useState<CatamarcaOpenRepo[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    getReposPublicos()
      .then((data) => { if (active) setRepos(data) })
      .catch((err: unknown) => {
        if (active) toast.error((err as { message?: string })?.message ?? 'Error al cargar proyectos')
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
          <Button
            asChild
            className="text-white shrink-0 gap-2"
            style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
          >
            <Link href="/catamarcaopen/proyectos/nuevo">
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Publicar proyecto
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <RepoSkeleton key={i} />)}
          </div>
        ) : !repos || repos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Github className="h-10 w-10 text-slate-300 mb-4" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-600 mb-1">Todavía no hay proyectos publicados</p>
            <p className="text-xs text-slate-400 mb-6">¡Sé el primero en compartir tu repositorio!</p>
            <Button
              asChild
              size="sm"
              className="text-white gap-2"
              style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
            >
              <Link href="/catamarcaopen/proyectos/nuevo">
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                Publicar proyecto
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
          </div>
        )}
      </div>
    </main>
  )
}
EOF
ok "proyectos/page.tsx"

# ─── 4. Página nuevo — /catamarcaopen/proyectos/nuevo ─────────────────────────
log "Actualizando app/catamarcaopen/proyectos/nuevo/page.tsx..."
cat > app/catamarcaopen/proyectos/nuevo/page.tsx << 'EOF'
// app/catamarcaopen/proyectos/nuevo/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Github, Loader2, LogIn, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { crearRepo } from "@/lib/catamarcaopen/api"

// Regex estricta: solo URLs de github.com con owner/repo
const GITHUB_URL_RE = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\/)?$/

export default function NuevoProyectoCatamarcaOpenPage() {
  const router = useRouter()
  const { user, loading, loginWithGoogle } = useAuth()

  const [url,         setUrl]         = useState("")
  const [nombre,      setNombre]      = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [rama,        setRama]        = useState("main")
  const [submitting,  setSubmitting]  = useState(false)
  const [signingIn,   setSigningIn]   = useState(false)
  const [submitted,   setSubmitted]   = useState(false)

  const urlValida   = GITHUB_URL_RE.test(url.trim())
  const isValid     = urlValida && nombre.trim().length >= 2

  // Auto-completar nombre desde la URL de GitHub
  const handleUrlBlur = () => {
    if (urlValida && !nombre.trim()) {
      const parts = url.trim().replace(/\/$/, '').split('/')
      const repoName = parts[parts.length - 1] ?? ''
      if (repoName) setNombre(repoName)
    }
  }

  const handleLogin = async () => {
    if (signingIn) return
    setSigningIn(true)
    try {
      await loginWithGoogle()
    } catch (err: unknown) {
      const e = err as { message?: string }
      toast.error(e?.message ?? 'Error al iniciar sesión')
    } finally {
      setSigningIn(false)
    }
  }

  const handleSubmit = async () => {
    if (!isValid || submitting || !user) return
    setSubmitting(true)
    try {
      const idToken = await user.getIdToken()
      await crearRepo(
        {
          url:         url.trim().replace(/\/$/, ''),
          nombre:      nombre.trim(),
          descripcion: descripcion.trim() || undefined,
          rama:        rama.trim() || 'main',
          publico:     true,
        },
        idToken,
      )
      setSubmitted(true)
    } catch (err: unknown) {
      const e = err as { message?: string }
      toast.error(e?.message ?? 'Error al publicar el proyecto')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading auth ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#26a7fc]" />
      </main>
    )
  }

  // ── Sin sesión ────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-[#26a7fc]/10">
          <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-[#26a7fc]/10 flex items-center justify-center mb-4">
              <Github className="h-7 w-7 text-[#26a7fc]" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Necesitás iniciar sesión</h1>
            <p className="text-sm text-muted-foreground mb-6 text-pretty">
              Para publicar un proyecto en CatamarcaOpen, iniciá sesión con tu cuenta de Google.
            </p>
            <Button
              onClick={handleLogin}
              disabled={signingIn}
              className="w-full text-white gap-2"
              style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
            >
              {signingIn
                ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                : <LogIn   className="h-4 w-4"              strokeWidth={1.5} />}
              Ingresar con Google
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  // ── Publicado con éxito ───────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-[#26a7fc]/10">
          <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-7 w-7 text-green-600" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">¡Proyecto publicado!</h1>
            <p className="text-sm text-muted-foreground mb-6 text-pretty">
              Tu repositorio ya está disponible en la comunidad CatamarcaOpen.
            </p>
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => {
                  setUrl(''); setNombre(''); setDescripcion(''); setRama('main'); setSubmitted(false)
                }}
              >
                Publicar otro
              </Button>
              <Button
                asChild
                className="flex-1 text-white rounded-xl"
                style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
              >
                <Link href="/catamarcaopen/proyectos">Ver proyectos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  // ── Formulario ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-xl">
        <Link
          href="/catamarcaopen/proyectos"
          className="inline-flex items-center gap-1.5 text-sm text-[#1c8fe0] hover:text-cyan-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Volver al listado
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Publicar un proyecto</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Compartí tu repositorio de GitHub con la comunidad del Nodo.
        </p>

        <Card className="border-[#26a7fc]/10">
          <CardContent className="pt-6 pb-7 space-y-5">

            {/* URL del repositorio */}
            <div className="space-y-1.5">
              <Label htmlFor="url" className="text-sm font-medium text-slate-700">
                URL del repositorio <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Github
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
                  strokeWidth={1.5}
                />
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={handleUrlBlur}
                  placeholder="https://github.com/usuario/repositorio"
                  className="pl-9 h-10 rounded-xl border-slate-200 focus:border-[#26a7fc] focus:ring-[#26a7fc]/20 bg-white"
                />
              </div>
              {url && !urlValida && (
                <p className="text-[11px] text-red-500">
                  Debe ser una URL de GitHub válida: https://github.com/usuario/repo
                </p>
              )}
            </div>

            {/* Nombre del proyecto */}
            <div className="space-y-1.5">
              <Label htmlFor="nombre" className="text-sm font-medium text-slate-700">
                Nombre del proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="ej: Sistema de Turnos Municipales"
                maxLength={200}
                className="h-10 rounded-xl border-slate-200 focus:border-[#26a7fc] focus:ring-[#26a7fc]/20 bg-white"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <Label htmlFor="descripcion" className="text-sm font-medium text-slate-700">
                Descripción
                <span className="text-slate-400 font-normal ml-1">(opcional)</span>
              </Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="¿Qué hace este proyecto? ¿Para qué sirve?"
                maxLength={500}
                rows={3}
                className="rounded-xl border-slate-200 focus:border-[#26a7fc] focus:ring-[#26a7fc]/20 bg-white resize-none"
              />
              <p className="text-[11px] text-slate-400 text-right">{descripcion.length}/500</p>
            </div>

            {/* Rama */}
            <div className="space-y-1.5">
              <Label htmlFor="rama" className="text-sm font-medium text-slate-700">
                Rama principal
                <span className="text-slate-400 font-normal ml-1">(opcional)</span>
              </Label>
              <Input
                id="rama"
                value={rama}
                onChange={(e) => setRama(e.target.value)}
                placeholder="main"
                maxLength={100}
                className="h-10 rounded-xl border-slate-200 focus:border-[#26a7fc] focus:ring-[#26a7fc]/20 bg-white"
              />
            </div>

            {/* Sesión activa */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
              <div className="h-6 w-6 rounded-full bg-[#26a7fc]/10 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-[#26a7fc]">
                  {user.displayName?.charAt(0).toUpperCase() ?? '?'}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                Publicando como <span className="font-medium text-slate-700">{user.displayName}</span>
              </p>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="w-full text-white gap-2 rounded-xl h-11 font-semibold disabled:opacity-50"
              style={
                isValid && !submitting
                  ? { backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }
                  : {}
              }
            >
              {submitting
                ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                : <Github  className="h-4 w-4"              strokeWidth={1.5} />}
              {submitting ? 'Publicando...' : 'Publicar proyecto'}
            </Button>

          </CardContent>
        </Card>
      </div>
    </main>
  )
}
EOF
ok "proyectos/nuevo/page.tsx"

sep
echo -e "${GREEN}✅  CatamarcaOpen front conectado a ciudadano-back${NC}"
echo ""
echo -e "  Archivos actualizados:"
echo -e "  ${YELLOW}lib/catamarcaopen/types.ts${NC}                 → tipos reales del back"
echo -e "  ${YELLOW}lib/catamarcaopen/api.ts${NC}                   → cliente real (ciudadano-back)"
echo -e "  ${YELLOW}app/catamarcaopen/proyectos/page.tsx${NC}        → listado real"
echo -e "  ${YELLOW}app/catamarcaopen/proyectos/nuevo/page.tsx${NC}  → formulario conectado"
echo ""
echo -e "  Variable de entorno requerida en ${YELLOW}.env.local${NC}:"
echo -e "  ${YELLOW}NEXT_PUBLIC_CIUDADANO_API_URL=https://api.ciudadano.nodo.cc.gob.ar${NC}"
echo ""
echo -e "  Nota: ${YELLOW}lib/catamarcaopen/data.ts${NC} queda como referencia histórica."
echo -e "        Se puede eliminar cuando confirmes que todo funciona."
sep