/**
 * lib/registro-link.ts
 *
 * Helper para construir la URL de registro-front con el idToken de Firebase
 * como queryParam (?ctoken=...) para que registro-front reconozca al ciudadano
 * automáticamente sin pedirle que vuelva a loguearse.
 *
 * El token se llama "ctoken" (ciudadano-token) para no colisionar con otros
 * params de Next.js y ser claro sobre su origen.
 *
 * Seguridad:
 *   - El idToken de Firebase dura 1 hora y está firmado por Google.
 *   - registro-front lo valida contra ciudadano-back (POST /auth/verify).
 *   - Si el token expiró o es inválido, registro-front cae al flujo normal.
 *   - No se loguea ni persiste el token en ningún lado.
 */

import type { User } from "firebase/auth"

const REGISTRO_BASE =
  (process.env.NEXT_PUBLIC_REGISTRO_URL ?? "").replace(/\/$/, "")

/**
 * Construye la URL de la preinscripción en registro-front.
 * Si el usuario está logueado agrega ?ctoken=idToken para SSO silencioso.
 *
 * @param slug   - slug del módulo de preinscripción (ej: "preinscripcion-placas")
 * @param user   - Firebase User | null (del AuthContext de ciudadano-front)
 */
export async function buildRegistroUrl(slug: string, user: User | null): Promise<string> {
  const base = `${REGISTRO_BASE}/preinscripciones/${slug}`

  if (!user) return base

  try {
    // getIdToken(false) usa el token en caché si aún es válido (no fuerza refresh)
    // getIdToken(true)  fuerza refresh — mejor para evitar expirado en el redirect
    const token = await user.getIdToken(true)
    return `${base}?ctoken=${encodeURIComponent(token)}`
  } catch {
    // Si falla (usuario desconectado, etc.) mandamos sin token — registro pide login
    return base
  }
}

/**
 * Versión síncrona para usar en <Link href> — NO incluye token.
 * Usar solo cuando no hay interacción del usuario (ej: links de navegación).
 * Para botones de "Inscribirse" usar buildRegistroUrl() async.
 */
export function registroUrl(slug: string): string {
  return `${REGISTRO_BASE}/preinscripciones/${slug}`
}
