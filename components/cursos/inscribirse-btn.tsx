"use client"

import { useState, useCallback, useEffect } from "react"
import { ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

const REGISTRO_BASE =
  (process.env.NEXT_PUBLIC_REGISTRO_URL ?? "").replace(/\/$/, "")

interface Props {
  slug: string
}

export function InscribirseBtn({ slug }: Props) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Evitar hydration mismatch — solo renderizar en cliente
  useEffect(() => { setMounted(true) }, [])

  const handleClick = useCallback(async () => {
    const base = `${REGISTRO_BASE}/preinscripciones/${slug}`
    setLoading(true)
    try {
      if (user) {
        const token = await user.getIdToken(true)
        window.location.href = `${base}?ctoken=${encodeURIComponent(token)}`
      } else {
        window.location.href = base
      }
    } catch {
      window.location.href = base
    } finally {
      setLoading(false)
    }
  }, [slug, user])

  // Mientras no está montado mostrar botón idéntico al SSR (sin interactividad)
  if (!mounted) {
    return (
      <Button size="lg" className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
        <ExternalLink className="h-4 w-4" />
        Inscribirme al curso
      </Button>
    )
  }

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
