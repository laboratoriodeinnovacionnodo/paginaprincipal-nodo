import type { Asiento, AreaCoworkingAPI } from "./types"

const COWORKING_API_URL = process.env.NEXT_PUBLIC_COWORKING_URL || "http://localhost:3000"

type AreaBackendResponse = {
  id: number
  nombre: string
  descripcion: string | null
  estado: "LIBRE" | "OCUPADO" | "LIMPIANDO" | "FUERA_DE_SERVICIO" | "PARA_COMPARTIR" | "COMPARTIDO"
  createdAt: string
}

export async function getAreas(): Promise<AreaCoworkingAPI[]> {
  try {
    console.log("[v0] Fetching coworking areas from:", `${COWORKING_API_URL}/areas`)
    const response = await fetch(`${COWORKING_API_URL}/areas`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error fetching areas: ${response.statusText}`)
    }

    const data: AreaBackendResponse[] = await response.json()
    console.log("[v0] Areas response:", data)

    return data.map((area) => ({
      id: area.id,
      nombre: area.nombre,
      tipo: "Espacio de trabajo",
      capacidad: 1,
      equipamiento: [],
      estado: area.estado,
      imagen: "/modern-coworking-space.png",
      descripcion: area.descripcion || undefined,
      disponible: area.estado === "LIBRE" || area.estado === "PARA_COMPARTIR",
      servicios: [],
      imagenesAdicionales: [],
    }))
  } catch (error) {
    console.error("[v0] Error fetching areas:", error)
    return []
  }
}

export async function getAreaById(id: number): Promise<AreaCoworkingAPI | null> {
  try {
    console.log("[v0] Fetching area by ID:", `${COWORKING_API_URL}/areas/${id}`)
    const response = await fetch(`${COWORKING_API_URL}/areas/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error fetching area: ${response.statusText}`)
    }

    const area: AreaBackendResponse = await response.json()
    console.log("[v0] Area response:", area)

    return {
      id: area.id,
      nombre: area.nombre,
      tipo: "Espacio de trabajo",
      capacidad: 1,
      equipamiento: ["Wi-Fi de alta velocidad", "Escritorio ergonómico", "Silla cómoda"],
      estado: area.estado,
      imagen: "/modern-coworking-space.png",
      descripcion: area.descripcion || undefined,
      precio: "$15/hora",
      disponible: area.estado === "LIBRE" || area.estado === "PARA_COMPARTIR",
      servicios: ["Wi-Fi", "Café gratis", "Impresora", "Sala de reuniones"],
      imagenesAdicionales: ["/coworking-meeting-room.jpg", "/coworking-desk.jpg"],
      detalles: {
        area: "12m²",
        iluminacion: "Natural y LED",
        mobiliario: ["Escritorio ajustable", "Silla ergonómica", "Cajonera"],
        tecnologia: ["Monitor 27 pulgadas", "Cable HDMI", "Enchufes USB"],
        accesoHorario: "24/7 con tarjeta de acceso",
      },
      usosPrincipales: ["Trabajo individual", "Reuniones virtuales", "Desarrollo de software"],
      caracteristicas: ["Silencioso", "Acceso a cocina", "Cerca de ventanas"],
    }
  } catch (error) {
    console.error("[v0] Error fetching area:", error)
    return null
  }
}

export function convertAreaToAsiento(area: AreaCoworkingAPI): Asiento {
  return {
    id: `asiento-${area.id}`,
    numero: area.id,
    estado: area.estado,
    notificaciones: undefined,
    imagen: area.imagen || "/modern-coworking-space.png",
    nombre: area.nombre,
  }
}
