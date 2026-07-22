#!/usr/bin/env bash
# =============================================================================
# ciudadano-nodo-front — v: connect ciudadano-back
#
# Conecta el frontend con ciudadano-back (NestJS/Prisma).
#
# CAMBIOS:
#   1. lib/ciudadano-api.ts       → cliente tipado para ciudadano-back
#   2. contexts/auth-context.tsx  → post-login llama POST /auth/login (upsert BD)
#                                   expone `perfil` (CiudadanoDB) en el contexto
#   3. app/perfil/page.tsx        → muestra datos del back (dni, phone, ciudad)
#                                   + tab "Mis actividades" con lineas reales
#   4. Dockerfile                 → agrega ARG/ENV NEXT_PUBLIC_CIUDADANO_API_URL
#   5. .github/workflows/deploy.yml → agrega el secret al build
#
# REQUISITOS:
#   - Correr desde la raíz de ciudadano-nodo-front
#   - NEXT_PUBLIC_CIUDADANO_API_URL en .env.local (ej: https://api.ciudadano.nodo.cc.gob.ar)
# =============================================================================
set -euo pipefail

CYAN='\033[0;36m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${CYAN}▶${NC} $*"; }
ok()   { echo -e "${GREEN}✔${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC} $*"; }
err()  { echo -e "${RED}✖${NC} $*"; exit 1; }
sep()  { echo -e "\n${CYAN}──────────────────────────────────────────────────────────────${NC}"; }

sep
echo -e "${CYAN}ciudadano-nodo-front — connect ciudadano-back${NC}"
sep

[[ -f "package.json" && -d "app" ]] || err "Ejecutá desde la raíz de ciudadano-nodo-front"
[[ -f "contexts/auth-context.tsx" ]] || err "No se encontró contexts/auth-context.tsx"
[[ -f "app/perfil/page.tsx" ]] || err "No se encontró app/perfil/page.tsx"

# ══════════════════════════════════════════════════════════════════════════════
# 1. lib/ciudadano-api.ts — cliente tipado para ciudadano-back
# ══════════════════════════════════════════════════════════════════════════════
log "Creando lib/ciudadano-api.ts..."
mkdir -p lib

cat > lib/ciudadano-api.ts << 'EOF'
/**
 * lib/ciudadano-api.ts
 *
 * Cliente tipado para ciudadano-back (NestJS/Prisma).
 * Base URL: NEXT_PUBLIC_CIUDADANO_API_URL
 *
 * Endpoints usados desde el front:
 *   POST /auth/login         → upsert ciudadano tras login con Google
 *   GET  /ciudadanos/me      → perfil propio (requiere Bearer token)
 *   PATCH /ciudadanos/me     → actualizar perfil extendido
 *   GET  /lineas/me          → actividades del ciudadano en el ecosistema NODO
 */

const BASE =
  (process.env.NEXT_PUBLIC_CIUDADANO_API_URL ?? "").replace(/\/$/, "") + "/api"

// ── Tipos que devuelve ciudadano-back ─────────────────────────────────────────

export type LineaStatus = "ACTIVA" | "INACTIVA" | "PENDIENTE" | "CANCELADA"

export interface CiudadanoLinea {
  id: string
  ciudadanoId: string
  systemSlug: string
  entityType: string
  entityId: string
  status: LineaStatus
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CiudadanoDB {
  id: string
  googleId: string
  email: string
  name: string
  picture: string | null
  phone: string | null
  dni: string | null
  birthDate: string | null
  address: string | null
  city: string | null
  province: string | null
  active: boolean
  systemSlugs: string[]
  createdAt: string
  updatedAt: string
  lastSeenAt: string
  lineas?: CiudadanoLinea[]
  _count?: { lineas: number }
}

export interface UpdatePerfilDto {
  phone?: string
  dni?: string
  birthDate?: string
  address?: string
  city?: string
  province?: string
}

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  idToken: string,
  options: RequestInit = {},
): Promise<T> {
  if (!BASE || BASE === "/api") {
    throw new Error(
      "[ciudadano-api] NEXT_PUBLIC_CIUDADANO_API_URL no está configurada",
    )
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
      ...(options.headers ?? {}),
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`[ciudadano-api] ${res.status} ${path} — ${body}`)
  }

  const json = await res.json()
  // El back envuelve en { data, statusCode, timestamp }
  return (json?.data ?? json) as T
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Verifica el idToken de Firebase y hace upsert del ciudadano en la BD.
 * Llamar UNA VEZ después del signInWithPopup exitoso.
 * No requiere Bearer porque el endpoint es @Public() en el back.
 */
export async function loginCiudadano(idToken: string): Promise<CiudadanoDB> {
  if (!BASE || BASE === "/api") {
    throw new Error(
      "[ciudadano-api] NEXT_PUBLIC_CIUDADANO_API_URL no está configurada",
    )
  }

  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`[ciudadano-api] login ${res.status} — ${body}`)
  }

  const json = await res.json()
  // El back devuelve { ciudadano, firebaseUid }
  const payload = json?.data ?? json
  return payload.ciudadano as CiudadanoDB
}

/**
 * GET /ciudadanos/me
 * Devuelve el perfil completo del ciudadano logueado, incluyendo sus lineas.
 */
export async function getMiPerfil(idToken: string): Promise<CiudadanoDB> {
  return apiFetch<CiudadanoDB>("/ciudadanos/me", idToken)
}

/**
 * PATCH /ciudadanos/me
 * Actualiza campos opcionales del perfil (dni, phone, ciudad, etc.)
 */
export async function updateMiPerfil(
  idToken: string,
  dto: UpdatePerfilDto,
): Promise<CiudadanoDB> {
  return apiFetch<CiudadanoDB>("/ciudadanos/me", idToken, {
    method: "PATCH",
    body: JSON.stringify(dto),
  })
}

/**
 * GET /lineas/me?systemSlug=cursos
 * Devuelve las actividades/vinculaciones del ciudadano en el ecosistema NODO.
 */
export async function getMisLineas(
  idToken: string,
  systemSlug?: string,
): Promise<CiudadanoLinea[]> {
  const qs = systemSlug ? `?systemSlug=${systemSlug}` : ""
  return apiFetch<CiudadanoLinea[]>(`/lineas/me${qs}`, idToken)
}
EOF
ok "lib/ciudadano-api.ts"

# ══════════════════════════════════════════════════════════════════════════════
# 2. contexts/auth-context.tsx — post-login upsert + expone `perfil`
# ══════════════════════════════════════════════════════════════════════════════
log "Actualizando contexts/auth-context.tsx..."

cat > contexts/auth-context.tsx << 'EOF'
"use client"

/**
 * contexts/auth-context.tsx
 *
 * AuthProvider — gestiona la sesión Firebase + perfil en ciudadano-back.
 *
 * Flujo:
 *   1. signInWithPopup (Google) → Firebase autentica
 *   2. onAuthStateChanged dispara → obtenemos idToken
 *   3. POST /auth/login en ciudadano-back → upsert del ciudadano en BD
 *   4. GET /ciudadanos/me → perfil completo con lineas
 *
 * Contexto expone:
 *   user    — Firebase User (displayName, email, photoURL, etc.)
 *   perfil  — CiudadanoDB (id, dni, phone, city, lineas, etc.) | null
 *   loading — true mientras se resuelve la sesión inicial
 *   loginWithGoogle()
 *   logout()
 *   refreshPerfil() — re-fetch manual del perfil (útil tras PATCH /me)
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import {
  loginCiudadano,
  getMiPerfil,
  type CiudadanoDB,
} from "@/lib/ciudadano-api"

interface AuthContextValue {
  user: User | null
  perfil: CiudadanoDB | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshPerfil: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Errores de Firebase que NO son fallos reales
const IGNORED_FIREBASE_ERRORS = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
])

function isIgnoredFirebaseError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const code = (error as { code?: string }).code
  return typeof code === "string" && IGNORED_FIREBASE_ERRORS.has(code)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<CiudadanoDB | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Sincroniza con ciudadano-back: hace upsert y luego fetcha el perfil completo.
   * Se llama tanto en el primer login como en cada recarga de sesión.
   */
  const syncConBack = useCallback(async (firebaseUser: User) => {
    try {
      const idToken = await firebaseUser.getIdToken()

      // Upsert — crea o actualiza el ciudadano en la BD
      await loginCiudadano(idToken)

      // Perfil completo con lineas
      const ciudadanoDB = await getMiPerfil(idToken)
      setPerfil(ciudadanoDB)
    } catch (err) {
      // Si el back no está disponible (NEXT_PUBLIC_CIUDADANO_API_URL no seteada
      // o error de red), logueamos pero NO rompemos la sesión Firebase.
      console.warn("[auth] ciudadano-back no disponible o no configurado:", err)
      setPerfil(null)
    }
  }, [])

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        await syncConBack(firebaseUser)
      } else {
        setPerfil(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [syncConBack])

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) {
      console.warn("[auth] Firebase no está configurado (faltan NEXT_PUBLIC_FIREBASE_*)")
      return
    }
    try {
      await signInWithPopup(auth, googleProvider)
      // onAuthStateChanged se encarga del syncConBack
    } catch (error) {
      if (!isIgnoredFirebaseError(error)) {
        console.error("[auth] Error en login con Google:", error)
        throw error
      }
    }
  }

  const logout = async () => {
    if (!auth) return
    await firebaseSignOut(auth)
    setPerfil(null)
  }

  /** Re-fetcha el perfil desde ciudadano-back (usar tras PATCH /me). */
  const refreshPerfil = useCallback(async () => {
    if (!user) return
    try {
      const idToken = await user.getIdToken()
      const ciudadanoDB = await getMiPerfil(idToken)
      setPerfil(ciudadanoDB)
    } catch (err) {
      console.error("[auth] Error al refrescar perfil:", err)
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{ user, perfil, loading, loginWithGoogle, logout, refreshPerfil }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>")
  return ctx
}
EOF
ok "contexts/auth-context.tsx"

# ══════════════════════════════════════════════════════════════════════════════
# 3. app/perfil/page.tsx — perfil completo con datos de BD + lineas
# ══════════════════════════════════════════════════════════════════════════════
log "Actualizando app/perfil/page.tsx..."
mkdir -p app/perfil

cat > app/perfil/page.tsx << 'EOF'
"use client"

/**
 * app/perfil/page.tsx
 *
 * Página de perfil del ciudadano.
 * Muestra datos de Firebase (nombre, foto) + datos extendidos de ciudadano-back
 * (dni, teléfono, ciudad, provincia) + lineas/actividades del ecosistema NODO.
 */

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { updateMiPerfil, type UpdatePerfilDto } from "@/lib/ciudadano-api"
import { UserPhoto } from "@/components/ui/user-photo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  Activity,
  LogIn,
  LogOut,
  Loader2,
  GraduationCap,
  Phone,
  MapPin,
  CreditCard,
  Pencil,
  Save,
  X,
  Layers,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined, locale = "es-AR") {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

const SYSTEM_LABEL: Record<string, string> = {
  cursos: "Cursos",
  eventos: "Eventos",
  "profe-ia": "Profe IA",
  catamarcaopen: "CatamarcaOpen",
  laboratorio: "Laboratorio",
  aula: "Aula Virtual",
  registro: "Registro",
}

const LINEA_STATUS_COLOR: Record<string, string> = {
  ACTIVA: "bg-emerald-100 text-emerald-700",
  INACTIVA: "bg-gray-100 text-gray-500",
  PENDIENTE: "bg-amber-100 text-amber-700",
  CANCELADA: "bg-red-100 text-red-600",
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function PerfilPage() {
  const { user, perfil, loading, loginWithGoogle, logout, refreshPerfil } = useAuth()

  const [signingIn, setSigningIn] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<UpdatePerfilDto>({})

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleLogin = async () => {
    if (signingIn) return
    setSigningIn(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error("[perfil] Error al iniciar sesión:", error)
    } finally {
      setSigningIn(false)
    }
  }

  const handleLogout = async () => {
    if (signingOut) return
    setSigningOut(true)
    try {
      await logout()
    } catch (error) {
      console.error("[perfil] Error al cerrar sesión:", error)
    } finally {
      setSigningOut(false)
    }
  }

  const startEdit = () => {
    setForm({
      phone: perfil?.phone ?? "",
      dni: perfil?.dni ?? "",
      address: perfil?.address ?? "",
      city: perfil?.city ?? "",
      province: perfil?.province ?? "",
    })
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setForm({})
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const idToken = await user.getIdToken()
      // Filtrar campos vacíos para no pisar con string vacío
      const payload: UpdatePerfilDto = {}
      if (form.phone?.trim()) payload.phone = form.phone.trim()
      if (form.dni?.trim()) payload.dni = form.dni.trim()
      if (form.address?.trim()) payload.address = form.address.trim()
      if (form.city?.trim()) payload.city = form.city.trim()
      if (form.province?.trim()) payload.province = form.province.trim()

      await updateMiPerfil(idToken, payload)
      await refreshPerfil()
      setEditing(false)
    } catch (err) {
      console.error("[perfil] Error al guardar:", err)
    } finally {
      setSaving(false)
    }
  }

  // ── Estados de carga y no autenticado ────────────────────────────────────────

  if (loading) {
    return (
      <main className="min-h-screen pt-32 pb-16 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex flex-col items-center gap-4 mb-10">
            <Skeleton className="h-28 w-28 rounded-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen pt-32 pb-16 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-cyan-100">
          <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
            <div className="mb-5 h-16 w-16 rounded-2xl bg-cyan-100 flex items-center justify-center">
              <UserRound className="h-8 w-8 text-cyan-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu perfil de ciudadano</h1>
            <p className="text-sm text-muted-foreground mb-6 text-pretty">
              Iniciá sesión con tu cuenta de Google para ver y gestionar tu perfil,
              tus cursos e inscripciones.
            </p>
            <Button
              size="lg"
              onClick={handleLogin}
              disabled={signingIn}
              className="w-full text-white"
              style={{ backgroundImage: "linear-gradient(to right, #0EA5E9, #0284C7)" }}
            >
              {signingIn
                ? <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                : <LogIn className="mr-2 h-5 w-5" />}
              {signingIn ? "Ingresando..." : "Ingresar con Google"}
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  // ── Autenticado ───────────────────────────────────────────────────────────────

  const displayName = perfil?.name ?? user.displayName ?? "Ciudadano NODO"
  const createdAt = perfil
    ? formatDate(perfil.createdAt)
    : formatDate(user.metadata?.creationTime ?? null)
  const lastLogin = formatDate(user.metadata?.lastSignInTime ?? null)
  const lineas = perfil?.lineas ?? []

  return (
    <main className="min-h-screen pt-32 pb-16 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Avatar + nombre */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <UserPhoto
            name={displayName}
            photoURL={perfil?.picture ?? user.photoURL}
            sizeClass="h-28 w-28"
          />
          <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {perfil && (
            <div className="flex flex-wrap gap-2 justify-center">
              {perfil.systemSlugs.map((slug) => (
                <Badge key={slug} variant="secondary" className="text-xs bg-cyan-50 text-cyan-700 border-cyan-200">
                  {SYSTEM_LABEL[slug] ?? slug}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Botón cerrar sesión */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={signingOut}
            className="text-gray-600 border-gray-200"
          >
            {signingOut
              ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              : <LogOut className="mr-2 h-4 w-4" />}
            Cerrar sesión
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="datos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/70 border border-cyan-100">
            <TabsTrigger value="datos">Datos</TabsTrigger>
            <TabsTrigger value="actividad">
              Actividad
              {lineas.length > 0 && (
                <span className="ml-1.5 text-xs bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded-full">
                  {lineas.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="cursos">Mis cursos</TabsTrigger>
          </TabsList>

          {/* ── Tab: Datos ──────────────────────────────────────────────── */}
          <TabsContent value="datos" className="mt-6 space-y-4">

            {/* Identidad Google (solo lectura) */}
            <Card className="border-cyan-100">
              <CardContent className="pt-6 divide-y divide-gray-100">
                <div className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserRound className="h-4 w-4" /> Nombre
                  </span>
                  <span className="text-sm font-medium text-gray-900">{displayName}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" /> Correo
                  </span>
                  <span className="text-sm font-medium text-gray-900">{user.email ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" /> Cuenta verificada
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {user.emailVerified ? "Sí" : "No"}
                  </span>
                </div>
                {createdAt && (
                  <div className="flex items-center justify-between py-3">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" /> Ciudadano desde
                    </span>
                    <span className="text-sm font-medium text-gray-900">{createdAt}</span>
                  </div>
                )}
                {lastLogin && (
                  <div className="flex items-center justify-between py-3">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="h-4 w-4" /> Último acceso
                    </span>
                    <span className="text-sm font-medium text-gray-900">{lastLogin}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Perfil extendido (editable) */}
            <Card className="border-cyan-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">Datos adicionales</h3>
                  {!editing ? (
                    <Button variant="ghost" size="sm" onClick={startEdit} className="text-cyan-600 hover:text-cyan-700">
                      <Pencil className="h-4 w-4 mr-1" /> Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={saving} className="text-gray-500">
                        <X className="h-4 w-4 mr-1" /> Cancelar
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={saving}
                        className="text-white"
                        style={{ backgroundImage: "linear-gradient(to right, #0EA5E9, #0284C7)" }}>
                        {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                        Guardar
                      </Button>
                    </div>
                  )}
                </div>

                {!editing ? (
                  <div className="divide-y divide-gray-100">
                    <div className="flex items-center justify-between py-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CreditCard className="h-4 w-4" /> DNI
                      </span>
                      <span className="text-sm font-medium text-gray-900">{perfil?.dni ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" /> Teléfono
                      </span>
                      <span className="text-sm font-medium text-gray-900">{perfil?.phone ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" /> Dirección
                      </span>
                      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                        {[perfil?.address, perfil?.city, perfil?.province].filter(Boolean).join(", ") || "—"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="dni" className="text-xs text-muted-foreground">DNI</Label>
                        <Input
                          id="dni"
                          placeholder="12345678"
                          value={form.dni ?? ""}
                          onChange={(e) => setForm((p) => ({ ...p, dni: e.target.value }))}
                          className="border-cyan-100 focus-visible:ring-cyan-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs text-muted-foreground">Teléfono</Label>
                        <Input
                          id="phone"
                          placeholder="383-4000000"
                          value={form.phone ?? ""}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                          className="border-cyan-100 focus-visible:ring-cyan-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="address" className="text-xs text-muted-foreground">Dirección</Label>
                        <Input
                          id="address"
                          placeholder="Av. Belgrano 123"
                          value={form.address ?? ""}
                          onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                          className="border-cyan-100 focus-visible:ring-cyan-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="city" className="text-xs text-muted-foreground">Ciudad</Label>
                        <Input
                          id="city"
                          placeholder="San Fernando del Valle..."
                          value={form.city ?? ""}
                          onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                          className="border-cyan-100 focus-visible:ring-cyan-300"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="province" className="text-xs text-muted-foreground">Provincia</Label>
                        <Input
                          id="province"
                          placeholder="Catamarca"
                          value={form.province ?? ""}
                          onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
                          className="border-cyan-100 focus-visible:ring-cyan-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tab: Actividad (lineas) ─────────────────────────────────── */}
          <TabsContent value="actividad" className="mt-6">
            {lineas.length === 0 ? (
              <Card className="border-cyan-100">
                <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
                  <div className="mb-4 h-14 w-14 rounded-2xl bg-cyan-100 flex items-center justify-center">
                    <Layers className="h-7 w-7 text-cyan-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Sin actividad registrada</h3>
                  <p className="text-sm text-muted-foreground max-w-sm text-pretty">
                    Cuando uses los servicios del Nodo (cursos, eventos, laboratorio) tu actividad
                    aparecerá acá.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {lineas.map((linea) => (
                  <Card key={linea.id} className="border-cyan-100 hover:border-cyan-300 transition-colors">
                    <CardContent className="pt-4 pb-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {SYSTEM_LABEL[linea.systemSlug] ?? linea.systemSlug}
                          <span className="text-muted-foreground font-normal"> · {linea.entityType}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(linea.createdAt) ?? linea.createdAt}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${LINEA_STATUS_COLOR[linea.status] ?? "bg-gray-100 text-gray-500"}`}
                      >
                        {linea.status}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Tab: Mis cursos ─────────────────────────────────────────── */}
          <TabsContent value="cursos" className="mt-6">
            {(() => {
              const cursosLineas = lineas.filter((l) => l.systemSlug === "cursos")
              if (cursosLineas.length === 0) {
                return (
                  <Card className="border-cyan-100">
                    <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
                      <div className="mb-4 h-14 w-14 rounded-2xl bg-cyan-100 flex items-center justify-center">
                        <GraduationCap className="h-7 w-7 text-cyan-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Todavía no tenés cursos ni inscripciones
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-sm text-pretty">
                        Cuando te inscribas a un curso del Nodo, vas a verlo acá con su estado y progreso.
                      </p>
                      <Button asChild variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50">
                        <Link href="/cursos">Ver cursos disponibles</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              }
              return (
                <div className="space-y-3">
                  {cursosLineas.map((linea) => {
                    const meta = linea.metadata as Record<string, string>
                    return (
                      <Card key={linea.id} className="border-cyan-100">
                        <CardContent className="pt-4 pb-4 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {meta?.cursoTitle ?? linea.entityId}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                              {linea.entityType} · {formatDate(linea.createdAt)}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${LINEA_STATUS_COLOR[linea.status] ?? "bg-gray-100 text-gray-500"}`}
                          >
                            {linea.status}
                          </span>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )
            })()}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
EOF
ok "app/perfil/page.tsx"

# ══════════════════════════════════════════════════════════════════════════════
# 4. Dockerfile — agrega ARG/ENV NEXT_PUBLIC_CIUDADANO_API_URL
# ══════════════════════════════════════════════════════════════════════════════
log "Actualizando Dockerfile..."

if grep -q "NEXT_PUBLIC_CIUDADANO_API_URL" Dockerfile 2>/dev/null; then
  warn "Dockerfile ya tiene NEXT_PUBLIC_CIUDADANO_API_URL — saltando"
else
  # Inserta el secret mount justo antes del pnpm run build
  # Busca la línea del pnpm build y agrega el secret antes
  sed -i 's|--mount=type=secret,id=NEXT_PUBLIC_FIREBASE_APP_ID \\|--mount=type=secret,id=NEXT_PUBLIC_FIREBASE_APP_ID \\\n    --mount=type=secret,id=NEXT_PUBLIC_CIUDADANO_API_URL \\|g' Dockerfile

  # Agrega la variable de entorno en el bloque ENV del build
  sed -i 's|NEXT_PUBLIC_FIREBASE_APP_ID=$(cat /run/secrets/NEXT_PUBLIC_FIREBASE_APP_ID) \\|NEXT_PUBLIC_FIREBASE_APP_ID=$(cat /run/secrets/NEXT_PUBLIC_FIREBASE_APP_ID) \\\n    NEXT_PUBLIC_CIUDADANO_API_URL=$(cat /run/secrets/NEXT_PUBLIC_CIUDADANO_API_URL) \\|g' Dockerfile

  ok "Dockerfile actualizado"
fi

# ══════════════════════════════════════════════════════════════════════════════
# 5. .github/workflows/deploy.yml — agrega el secret al CI
# ══════════════════════════════════════════════════════════════════════════════
DEPLOY_YML=".github/workflows/deploy.yml"
log "Actualizando $DEPLOY_YML..."

if [[ -f "$DEPLOY_YML" ]]; then
  if grep -q "NEXT_PUBLIC_CIUDADANO_API_URL" "$DEPLOY_YML" 2>/dev/null; then
    warn "$DEPLOY_YML ya tiene NEXT_PUBLIC_CIUDADANO_API_URL — saltando"
  else
    # Agrega el secret después de NEXT_PUBLIC_FIREBASE_APP_ID en el bloque secrets del build
    sed -i 's|"NEXT_PUBLIC_FIREBASE_APP_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}"|"NEXT_PUBLIC_FIREBASE_APP_ID=${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}"\n              "NEXT_PUBLIC_CIUDADANO_API_URL=${{ secrets.NEXT_PUBLIC_CIUDADANO_API_URL }}"|g' "$DEPLOY_YML"
    ok "$DEPLOY_YML actualizado"
  fi
else
  warn "$DEPLOY_YML no encontrado — agregá manualmente el secret NEXT_PUBLIC_CIUDADANO_API_URL"
fi

# ══════════════════════════════════════════════════════════════════════════════
# 6. .env.local — agrega la variable si no existe (solo dev)
# ══════════════════════════════════════════════════════════════════════════════
log "Verificando .env.local..."
if [[ -f ".env.local" ]]; then
  if grep -q "NEXT_PUBLIC_CIUDADANO_API_URL" .env.local; then
    warn ".env.local ya tiene NEXT_PUBLIC_CIUDADANO_API_URL"
  else
    echo "" >> .env.local
    echo "# ciudadano-back — API de perfil de ciudadanos NODO" >> .env.local
    echo "NEXT_PUBLIC_CIUDADANO_API_URL=https://api.ciudadano.nodo.cc.gob.ar" >> .env.local
    ok ".env.local actualizado"
  fi
else
  cat > .env.local << 'ENVEOF'
# ciudadano-back — API de perfil de ciudadanos NODO
NEXT_PUBLIC_CIUDADANO_API_URL=https://api.ciudadano.nodo.cc.gob.ar
ENVEOF
  ok ".env.local creado (completá las otras variables Firebase que ya tenés)"
fi

# ══════════════════════════════════════════════════════════════════════════════
# Resumen
# ══════════════════════════════════════════════════════════════════════════════
sep
echo -e "${GREEN}✅ ciudadano-front conectado con ciudadano-back${NC}"
sep
echo ""
echo -e "Archivos modificados:"
echo -e "  ${CYAN}lib/ciudadano-api.ts${NC}          → cliente tipado (login, me, patch, lineas)"
echo -e "  ${CYAN}contexts/auth-context.tsx${NC}     → post-login upsert + expone \`perfil\` (CiudadanoDB)"
echo -e "  ${CYAN}app/perfil/page.tsx${NC}           → perfil completo + edición + lineas NODO"
echo -e "  ${CYAN}Dockerfile${NC}                    → secret NEXT_PUBLIC_CIUDADANO_API_URL"
echo -e "  ${CYAN}.github/workflows/deploy.yml${NC}  → secret al CI"
echo -e "  ${CYAN}.env.local${NC}                    → variable para desarrollo local"
echo ""
echo -e "${YELLOW}⚠  Verificá .env.local — ajustá NEXT_PUBLIC_CIUDADANO_API_URL si usás otro host${NC}"
echo -e "${YELLOW}⚠  Agregá NEXT_PUBLIC_CIUDADANO_API_URL como secret en GitHub Actions${NC}"
echo -e "${YELLOW}⚠  Si el Dockerfile usa ARG en lugar de secrets, ajustá manualmente${NC}"
echo ""
echo -e "${CYAN}Flujo de login resultante:${NC}"
echo -e "  1. Usuario clickea 'Ingresar con Google'"
echo -e "  2. Firebase popup → signInWithPopup"
echo -e "  3. onAuthStateChanged → getIdToken()"
echo -e "  4. POST /api/auth/login → upsert en BD"
echo -e "  5. GET  /api/ciudadanos/me → perfil completo con lineas"
echo -e "  6. \`perfil\` disponible en useAuth() en toda la app"
sep