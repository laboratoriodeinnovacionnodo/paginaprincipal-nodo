"use client"

import { useState, useEffect, useCallback } from "react"
import type { AreaBackendResponse } from "@/lib/coworking/types"
import { getAreas } from "@/lib/coworking/api"

const POLL_INTERVAL = 30_000 // 30 segundos

export function useCoworking() {
  const [areas, setAreas]               = useState<AreaBackendResponse[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [ultimaActualizacion, setUltima]= useState<string>("")

  const cargar = useCallback(async () => {
    try {
      const data = await getAreas()
      setAreas(data)
      setError(null)
    } catch (e) {
      setError("No se pudo conectar con el servidor de coworking.")
      console.error(e)
    } finally {
      setLoading(false)
      setUltima(
        new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    }
  }, [])

  useEffect(() => {
    cargar()
    const id = setInterval(cargar, POLL_INTERVAL)
    return () => clearInterval(id)
  }, [cargar])

  return { areas, loading, error, ultimaActualizacion, refetch: cargar }
}
