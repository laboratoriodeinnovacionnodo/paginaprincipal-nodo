#!/usr/bin/env bash
# =============================================================================
# ciudadano-front — Fix toast 409 CatamarcaOpen
# El apiFetch lanza error sin status code → el catch no detecta el 409.
# Fix: clase ApiError con statusCode + catch tipado en la página.
# CORRER PARADO EN LA RAÍZ DE ciudadano-front
# =============================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${BLUE}[fix]${NC} $1"; }
ok()   { echo -e "${GREEN}✔${NC}  $1"; }
sep()  { echo -e "\n${GREEN}────────────────────────────────────────────────${NC}"; }

sep
echo -e "${GREEN}Fix — toast 409 CatamarcaOpen${NC}"
sep

[[ -f "package.json" ]] || { echo "Ejecutar desde la raíz de ciudadano-front"; exit 1; }

# ─── 1. api.ts — ApiError con statusCode ──────────────────────────────────────
log "Actualizando lib/catamarcaopen/api.ts..."
cat > lib/catamarcaopen/api.ts << 'EOF'
// lib/catamarcaopen/api.ts
import type { CatamarcaOpenRepo, CreateRepoInput, UpdateRepoInput } from './types'

const BASE = (process.env.NEXT_PUBLIC_CIUDADANO_API_URL ?? '').replace(/\/$/, '') + '/api/v1'

// Error tipado que incluye el status HTTP
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiFetch<T>(
  path: string,
  idToken: string,
  options: RequestInit = {},
): Promise<T> {
  if (!BASE || BASE === '/api/v1') {
    throw new ApiError(0, '[catamarcaopen-api] NEXT_PUBLIC_CIUDADANO_API_URL no está configurada')
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
    // Intentar leer el mensaje del body JSON que devuelve ciudadano-back
    let message = res.statusText
    try {
      const body = await res.json()
      message = body?.message ?? body?.error ?? message
    } catch {
      // body no es JSON, usar statusText
    }
    throw new ApiError(res.status, message)
  }

  const json = await res.json()
  return (json?.data ?? json) as T
}

// ── Endpoints públicos ────────────────────────────────────────────────────────

export async function getReposPublicos(): Promise<CatamarcaOpenRepo[]> {
  const url = `${BASE}/catamarcaopen/publicos`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    let message = res.statusText
    try { const b = await res.json(); message = b?.message ?? message } catch { /* noop */ }
    throw new ApiError(res.status, message)
  }
  const json = await res.json()
  return (json?.data ?? json) as CatamarcaOpenRepo[]
}

// ── Endpoints autenticados ────────────────────────────────────────────────────

export async function getMisRepos(idToken: string): Promise<CatamarcaOpenRepo[]> {
  return apiFetch<CatamarcaOpenRepo[]>('/catamarcaopen/me', idToken)
}

export async function crearRepo(
  input: CreateRepoInput,
  idToken: string,
): Promise<CatamarcaOpenRepo> {
  return apiFetch<CatamarcaOpenRepo>('/catamarcaopen', idToken, {
    method: 'POST',
    body:   JSON.stringify(input),
  })
}

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

export async function eliminarRepo(
  id: string,
  idToken: string,
): Promise<{ id: string; deleted: boolean }> {
  return apiFetch(`/catamarcaopen/${id}`, idToken, { method: 'DELETE' })
}
EOF
ok "lib/catamarcaopen/api.ts"

# ─── 2. nuevo/page.tsx — catch con ApiError ───────────────────────────────────
log "Actualizando app/catamarcaopen/proyectos/nuevo/page.tsx..."
cat > app/catamarcaopen/proyectos/nuevo/page.tsx << 'EOF'
// app/catamarcaopen/proyectos/nuevo/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Github, Loader2, LogIn, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { crearRepo, ApiError } from "@/lib/catamarcaopen/api"

const GITHUB_URL_RE = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\/)?$/

export default function NuevoProyectoCatamarcaOpenPage() {
  const { user, loading, loginWithGoogle } = useAuth()

  const [url,         setUrl]         = useState("")
  const [nombre,      setNombre]      = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [rama,        setRama]        = useState("main")
  const [submitting,  setSubmitting]  = useState(false)
  const [signingIn,   setSigningIn]   = useState(false)
  const [submitted,   setSubmitted]   = useState(false)

  const urlValida = GITHUB_URL_RE.test(url.trim())
  const isValid   = urlValida && nombre.trim().length >= 2

  const handleUrlBlur = () => {
    if (urlValida && !nombre.trim()) {
      const parts    = url.trim().replace(/\/$/, '').split('/')
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
      toast.error((err as { message?: string })?.message ?? 'Error al iniciar sesión')
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
      if (err instanceof ApiError && err.statusCode === 409) {
        toast.error('Este repositorio ya fue cargado en CatamarcaOpen.')
      } else {
        const msg = err instanceof Error ? err.message : 'Error al publicar el proyecto'
        toast.error(msg)
      }
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
                  setUrl(''); setNombre(''); setDescripcion('')
                  setRama('main'); setSubmitted(false)
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
ok "nuevo/page.tsx"

sep
echo -e "${GREEN}✅  Fix aplicado${NC}"
echo ""
echo -e "  El catch ahora detecta ${YELLOW}ApiError.statusCode === 409${NC}"
echo -e "  y muestra: ${YELLOW}'Este repositorio ya fue cargado en CatamarcaOpen.'${NC}"
sep