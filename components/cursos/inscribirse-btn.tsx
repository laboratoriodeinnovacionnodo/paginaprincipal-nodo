"use client"

/**
 * InscribirseBtn — Client Component
 *
 * Reemplaza el <a href={buildInscripcionUrl}> estático en el Server Component.
 * Obtiene el idToken de Firebase (si el usuario está logueado en ciudadano-front)
 * y redirige a registro-front con ?ctoken=TOKEN para SSO silencioso.
 *
 * Si el usuario NO está logueado redirige igual sin token — registro pide login.
 */

import { useState, useCallback } from "react"
import { ExternalLink, Loader2 }  from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

const REGISTRO_BASE =
  (process.env.NEXT_PUBLIC_REGISTRO_URL ?? "").replace(/\/$/, "")

interface Props {
  /** slug del módulo de preinscripción — ej: "preinscripcion-robot-basic" */
  slug: string
}

export function InscribirseBtn({ slug }: Props) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    const base = `${REGISTRO_BASE}/preinscripciones/${slug}`
    setLoading(true)
    try {
      if (user) {
        // getIdToken(true) fuerza refresh para evitar token expirado
        const token = await user.getIdToken(true)
        window.location.href = `${base}?ctoken=${encodeURIComponent(token)}`
      } else {
        // Sin sesión → flujo normal, registro pedirá login con Google
        window.location.href = base
      }
    } catch {
      window.location.href = base
    } finally {
      setLoading(false)
    }
  }, [slug, user])

  return (
    <Button
      size="lg"
      onClick={handleClick}
      disabled={loading}
      className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
    >
      {loading
        ? <Loader2 className="h-4 w-4 animate-spin" />
        : <ExternalLink className="h-4 w-4" />
      }
      {loading ? "Redirigiendo..." : "Inscribirme al curso"}
    </Button>
  )
}
