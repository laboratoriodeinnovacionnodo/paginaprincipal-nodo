"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { ProjectArea } from "@/lib/laboratorio/types"

export type AreaFiltro = ProjectArea | "TODOS"

const AREAS_VALIDAS: ProjectArea[] = ["DISENO_3D", "HARDWARE", "SOFTWARE"]

export const useLaboratorioFilter = () => {
  const searchParams = useSearchParams()

  const areaFromUrl = searchParams.get("area")
  const initialArea: AreaFiltro =
    areaFromUrl && AREAS_VALIDAS.includes(areaFromUrl as ProjectArea) ? (areaFromUrl as ProjectArea) : "TODOS"

  const [areaActiva, setAreaActivaState] = useState<AreaFiltro>(initialArea)

  useEffect(() => {
    if (areaFromUrl && AREAS_VALIDAS.includes(areaFromUrl as ProjectArea)) {
      setAreaActivaState(areaFromUrl as ProjectArea)
    }
  }, [areaFromUrl])

  const setAreaActiva = (area: AreaFiltro) => {
    setAreaActivaState(area)
  }

  return { areaActiva, setAreaActiva }
}
