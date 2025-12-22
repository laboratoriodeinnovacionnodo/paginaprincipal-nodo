"use client"

import { useState } from "react"

export const useGraduadosFilter = () => {
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [mostrarResultados, setMostrarResultados] = useState(false)

  const limpiarBusqueda = () => {
    setBusqueda("")
    setPaginaActual(1)
    setMostrarResultados(false)
  }

  return {
    busqueda,
    paginaActual,
    mostrarResultados,
    setBusqueda,
    setPaginaActual,
    setMostrarResultados,
    limpiarBusqueda,
  }
}
