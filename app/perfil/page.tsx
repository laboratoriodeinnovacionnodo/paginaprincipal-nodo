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
          <Skeleton className="h-10 w-full rounded-xl mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen pt-32 pb-16 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-[#26a7fc]/10">
          <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
            <div className="mb-5 h-16 w-16 rounded-2xl bg-[#26a7fc]/10 flex items-center justify-center">
              <UserRound className="h-8 w-8 text-[#26a7fc]" />
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
              style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
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
                <Badge key={slug} variant="secondary" className="text-xs bg-[#26a7fc]/10 text-[#1c8fe0] border-[#26a7fc]/20">
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
          <TabsList className="grid w-full grid-cols-3 bg-white/70 border border-[#26a7fc]/10">
            <TabsTrigger value="datos">Datos</TabsTrigger>
            <TabsTrigger value="actividad">
              Actividad
              {lineas.length > 0 && (
                <span className="ml-1.5 text-xs bg-[#26a7fc]/10 text-[#1c8fe0] px-1.5 py-0.5 rounded-full">
                  {lineas.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="cursos">Mis cursos</TabsTrigger>
          </TabsList>

          {/* ── Tab: Datos ──────────────────────────────────────────────── */}
          <TabsContent value="datos" className="mt-6 space-y-4">

            {/* Identidad Google (solo lectura) */}
            <Card className="border-[#26a7fc]/10">
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
            <Card className="border-[#26a7fc]/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">Datos adicionales</h3>
                  {!editing ? (
                    <Button variant="ghost" size="sm" onClick={startEdit} className="text-[#26a7fc] hover:text-[#1c8fe0]">
                      <Pencil className="h-4 w-4 mr-1" /> Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={saving} className="text-gray-500">
                        <X className="h-4 w-4 mr-1" /> Cancelar
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={saving}
                        className="text-white"
                        style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}>
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
                          className="border-[#26a7fc]/10 focus-visible:ring-cyan-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs text-muted-foreground">Teléfono</Label>
                        <Input
                          id="phone"
                          placeholder="383-4000000"
                          value={form.phone ?? ""}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                          className="border-[#26a7fc]/10 focus-visible:ring-cyan-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="address" className="text-xs text-muted-foreground">Dirección</Label>
                        <Input
                          id="address"
                          placeholder="Av. Belgrano 123"
                          value={form.address ?? ""}
                          onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                          className="border-[#26a7fc]/10 focus-visible:ring-cyan-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="city" className="text-xs text-muted-foreground">Ciudad</Label>
                        <Input
                          id="city"
                          placeholder="San Fernando del Valle..."
                          value={form.city ?? ""}
                          onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                          className="border-[#26a7fc]/10 focus-visible:ring-cyan-300"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="province" className="text-xs text-muted-foreground">Provincia</Label>
                        <Input
                          id="province"
                          placeholder="Catamarca"
                          value={form.province ?? ""}
                          onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
                          className="border-[#26a7fc]/10 focus-visible:ring-cyan-300"
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
              <Card className="border-[#26a7fc]/10">
                <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
                  <div className="mb-4 h-14 w-14 rounded-2xl bg-[#26a7fc]/10 flex items-center justify-center">
                    <Layers className="h-7 w-7 text-[#26a7fc]" />
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
                  <Card key={linea.id} className="border-[#26a7fc]/10 hover:border-[#26a7fc]/30 transition-colors">
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
                  <Card className="border-[#26a7fc]/10">
                    <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
                      <div className="mb-4 h-14 w-14 rounded-2xl bg-[#26a7fc]/10 flex items-center justify-center">
                        <GraduationCap className="h-7 w-7 text-[#26a7fc]" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Todavía no tenés cursos ni inscripciones
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-sm text-pretty">
                        Cuando te inscribas a un curso del Nodo, vas a verlo acá con su estado y progreso.
                      </p>
                      <Button asChild variant="outline" className="border-[#26a7fc]/20 text-[#1c8fe0] hover:bg-[#26a7fc]/10">
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
                      <Card key={linea.id} className="border-[#26a7fc]/10">
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
