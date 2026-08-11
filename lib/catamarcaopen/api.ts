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
