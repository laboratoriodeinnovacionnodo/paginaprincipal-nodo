import type { Graduado, DiplomaResponse } from "./types"

const API_URL = process.env.NEXT_PUBLIC_BLOCKCHAIN_URL || "http://localhost:3000"

/**
 * Obtiene todos los graduados desde el backend blockchain
 */
export async function getAllGraduados(): Promise<Graduado[]> {
  try {
    const response = await fetch(`${API_URL}/diplomas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error al obtener graduados: ${response.status}`)
    }

    const data: DiplomaResponse[] = await response.json()

    return data.map((diploma) => ({
      id: diploma.id,
      nombre: diploma.nombre,
      apellido: "",
      dni: diploma.dni,
      curso: diploma.curso,
      fechaGraduacion: new Date().toISOString(),
      promedio: 0,
      institucion: "Nodo Tecnológico Catamarca",
      duracion: undefined,
      nivel: undefined,
      txHash: diploma.txHash || undefined,
      explorerUrl: diploma.explorerUrl || undefined,
    }))
  } catch (error) {
    console.error("Error fetching graduados:", error)
    throw error
  }
}

/**
 * Obtiene un diploma por ID desde el backend blockchain
 */
export async function getDiplomaById(id: number): Promise<Graduado | null> {
  try {
    const response = await fetch(`${API_URL}/diplomas/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Error al obtener diploma: ${response.status}`)
    }

    const diploma: DiplomaResponse = await response.json()

    return {
      id: diploma.id,
      nombre: diploma.nombre,
      apellido: "",
      dni: diploma.dni,
      curso: diploma.curso,
      fechaGraduacion: new Date().toISOString(),
      promedio: 0,
      institucion: "Nodo Tecnológico Catamarca",
      duracion: undefined,
      nivel: undefined,
      txHash: diploma.txHash,
      explorerUrl: diploma.explorerUrl,
    }
  } catch (error) {
    console.error("Error fetching diploma by ID:", error)
    throw error
  }
}

/**
 * Busca un diploma por txHash
 */
export async function getDiplomaByTxHash(txHash: string): Promise<Graduado | null> {
  try {
    const graduados = await getAllGraduados()
    const graduado = graduados.find((g) => g.txHash === txHash)

    if (!graduado) return null

    return await getDiplomaById(graduado.id)
  } catch (error) {
    console.error("Error fetching diploma by txHash:", error)
    throw error
  }
}

/**
 * Busca un graduado por DNI
 */
export async function getGraduadoByDni(dni: string): Promise<Graduado | null> {
  try {
    const response = await fetch(`${API_URL}/diplomas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error al buscar graduados: ${response.status}`)
    }

    const data: DiplomaResponse[] = await response.json()

    const diploma = data.find((d) => d.dni === dni || d.dni.replace(/\./g, "") === dni.replace(/\./g, ""))

    if (!diploma) {
      return null
    }

    return {
      id: diploma.id,
      nombre: diploma.nombre,
      apellido: "",
      dni: diploma.dni,
      curso: diploma.curso,
      fechaGraduacion: new Date().toISOString(),
      promedio: 0,
      institucion: "Nodo Tecnológico Catamarca",
      duracion: undefined,
      nivel: undefined,
      txHash: diploma.txHash,
      explorerUrl: diploma.explorerUrl,
    }
  } catch (error) {
    console.error("Error fetching graduado by DNI:", error)
    throw error
  }
}
