"use client"

import { useState, useEffect } from "react"
import type { Asiento } from "@/lib/coworking/types"
import { getAreas, convertAreaToAsiento } from "@/lib/coworking/api"

export const useCoworking = () => {
  const [asientos, setAsientos] = useState<Asiento[]>([])
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarAreas = async () => {
      setLoading(true)
      const areas = await getAreas()
      const asientosFromAPI = areas.map(convertAreaToAsiento)
      setAsientos(asientosFromAPI)
      setLoading(false)
    }

    cargarAreas()
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
    loading,
  }
}
