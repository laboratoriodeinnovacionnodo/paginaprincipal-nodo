import type { AreaBackendResponse, AreaCoworkingAPI, Asiento } from "./types"

const BASE = (
  process.env.NEXT_PUBLIC_COWORKING_URL ?? "http://localhost:3550"
).replace(/\/$/, "")

function mapArea(area: AreaBackendResponse): AreaCoworkingAPI {
  return {
    id: area.id,
    nombre: area.nombre,
    tipo: "Espacio de trabajo",
    capacidad: 1,
    equipamiento: ["Wi-Fi", "Escritorio ergonómico", "Silla cómoda"],
    estado: area.estado,
    imagen: "/modern-coworking-space.png",
    descripcion: area.descripcion ?? undefined,
    disponible: area.estado === "LIBRE" || area.estado === "PARA_COMPARTIR",
    servicios: ["Wi-Fi", "Café gratis", "Impresora"],
    imagenesAdicionales: [],
  }
}

export async function getAreas(): Promise<AreaCoworkingAPI[]> {
  try {
    const res = await fetch(`${BASE}/areas`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) throw new Error(`[coworking-api] GET /area → ${res.status}`)
    const data: AreaBackendResponse[] = await res.json()
    return data.map(mapArea)
  } catch (error) {
    console.error("[coworking-api] getAreas:", error)
    return []
  }
}

export async function getAreaById(id: number): Promise<AreaCoworkingAPI | null> {
  try {
    const res = await fetch(`${BASE}/areas/${id}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`[coworking-api] GET /area/${id} → ${res.status}`)
    const area: AreaBackendResponse = await res.json()
    return mapArea(area)
  } catch (error) {
    console.error("[coworking-api] getAreaById:", error)
    return null
  }
}

export function convertAreaToAsiento(area: AreaCoworkingAPI): Asiento {
  return {
    id: `asiento-${area.id}`,
    numero: area.id,
    estado: area.estado,
    notificaciones: undefined,
    imagen: area.imagen ?? "/modern-coworking-space.png",
    nombre: area.nombre,
  }
}
