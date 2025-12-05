"use client"

import { useState, useEffect } from "react"
import type { Asiento } from "@/lib/coworking/types"
import { generarAsientos } from "@/lib/coworking/data"

export const useCoworking = () => {
  const [asientos, setAsientos] = useState<Asiento[]>([])
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>("")

  useEffect(() => {
    setAsientos(generarAsientos())
    actualizarHora()

    const interval = setInterval(() => {
      actualizarHora()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const actualizarHora = () => {
    const ahora = new Date()
    setUltimaActualizacion(
      ahora.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    )
  }

  return {
    asientos,
    ultimaActualizacion,
  }
}
