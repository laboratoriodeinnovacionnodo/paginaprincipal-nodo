"use client"

/**
 * InscribirseButton
 *
 * Botón que redirige a registro-front con el idToken de Firebase para SSO.
 * Si el usuario NO está logueado, redirige igual (sin token) — registro pedirá login.
 * Si el usuario SÍ está logueado, el formulario de registro lo reconoce automáticamente.
 *
 * Uso:
 *   <InscribirseButton slug="preinscripcion-placas" label="Inscribirse" />
 *
 * Props:
 *   slug    — slug del módulo de preinscripción en registro-back
 *   label   — texto del botón (default: "Inscribirme")
 *   className — clases adicionales de Tailwind
 */

import { useState, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { buildRegistroUrl } from "@/lib/registro-link"

interface InscribirseButtonProps {
  slug:       string
  label?:     string
  className?: string
}

export function InscribirseButton({
  slug,
  label     = "Inscribirme",
  className = "",
}: InscribirseButtonProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setLoading(true)
    try {
      const url = await buildRegistroUrl(slug, user)
      window.location.href = url
    } catch {
      // Fallback sin token
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
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-60 disabled:cursor-wait ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? "Redirigiendo..." : label}
    </button>
  )
}
