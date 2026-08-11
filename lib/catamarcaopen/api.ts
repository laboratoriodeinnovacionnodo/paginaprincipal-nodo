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
