"use client"

/**
 * InscribirseButton
 *
 * Reemplaza el <a href={registroUrl}> estático.
 * Obtiene el idToken de Firebase, construye la URL con ?ctoken y redirige.
 * Si el usuario NO está logueado, redirige igual sin token.
 *
 * Uso:
 *   <InscribirseButton
 *     slug="preinscripcion-robot-basico"
 *     className="..."
 *   >
 *     Inscribirme
 *   </InscribirseButton>
 */

import { useState, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { buildRegistroUrl } from "@/lib/registro-link"

interface Props {
  slug:       string
  className?: string
  children?:  React.ReactNode
}

export function InscribirseButton({ slug, className = "", children }: Props) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setLoading(true)
    try {
      const url = await buildRegistroUrl(slug, user)
      window.location.href = url
    } catch {
      const base = (process.env.NEXT_PUBLIC_REGISTRO_URL ?? "").replace(/\/$/, "")
      window.location.href = `${base}/preinscripciones/${slug}`
    } finally {
      setLoading(false)
    }
  }, [slug, user])

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? "Redirigiendo..." : (children ?? "Inscribirme")}
    </button>
  )
}
