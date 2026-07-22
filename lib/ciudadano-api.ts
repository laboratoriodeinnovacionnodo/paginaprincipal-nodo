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
