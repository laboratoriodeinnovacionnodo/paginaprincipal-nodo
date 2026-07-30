/**
 * lib/registro-link.ts
 *
 * Construye la URL de registro-front con ?ctoken=<Firebase idToken>
 * para SSO silencioso — registro-front reconoce al ciudadano sin pedirle login.
 */
import type { User } from "firebase/auth"

const REGISTRO_BASE =
  (process.env.NEXT_PUBLIC_REGISTRO_URL ?? "").replace(/\/$/, "")

/**
 * Async — usar en onClick de botones de inscripción.
 * Obtiene un token fresco y construye la URL completa.
 */
export async function buildRegistroUrl(slug: string, user: User | null): Promise<string> {
  const base = `${REGISTRO_BASE}/preinscripciones/${slug}`
  if (!user || !REGISTRO_BASE) return base
  try {
    const token = await user.getIdToken(true)
    return `${base}?ctoken=${encodeURIComponent(token)}`
  } catch {
    return base
  }
}
