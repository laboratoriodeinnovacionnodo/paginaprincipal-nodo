#!/usr/bin/env bash
# =============================================================================
# fix-coworking-api.sh
# Fix: restaura getAreaById + tipos completos en lib/coworking
# Ejecutar desde la raíz de ciudadano-front
# =============================================================================
set -euo pipefail

echo "🔧 Restaurando lib/coworking/types.ts y api.ts..."

mkdir -p lib/coworking

# ---------------------------------------------------------------------------
# 1. types.ts — agrega Asiento y AreaCoworkingAPI que faltaban
# ---------------------------------------------------------------------------
cat > lib/coworking/types.ts << 'EOF'
export type EstadoAsiento =
  | "LIBRE"
  | "OCUPADO"
  | "LIMPIANDO"
  | "FUERA_DE_SERVICIO"
  | "PARA_COMPARTIR"
  | "COMPARTIDO"

export type AreaBackendResponse = {
  id: number
  nombre: string
  descripcion: string | null
  estado: EstadoAsiento
  createdAt: string
}

export type AreaCoworkingAPI = {
  id: number
  nombre: string
  tipo: string
  capacidad: number
  equipamiento: string[]
  estado: EstadoAsiento
  imagen?: string
  descripcion?: string
  precio?: string
  disponible: boolean
  servicios?: string[]
  imagenesAdicionales?: string[]
  detalles?: {
    area?: string
    iluminacion?: string
    mobiliario?: string[]
    tecnologia?: string[]
    accesoHorario?: string
  }
  usosPrincipales?: string[]
  caracteristicas?: string[]
}

export type Asiento = {
  id: string
  numero: number
  estado: EstadoAsiento
  notificaciones?: number
  imagen: string
  nombre: string
}
EOF
echo "✅ lib/coworking/types.ts"

# ---------------------------------------------------------------------------
# 2. api.ts — getAreas + getAreaById + convertAreaToAsiento
# ---------------------------------------------------------------------------
cat > lib/coworking/api.ts << 'EOF'
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
    const res = await fetch(`${BASE}/area`, {
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
    const res = await fetch(`${BASE}/area/${id}`, {
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
EOF
echo "✅ lib/coworking/api.ts"

echo ""
echo "✅ Fix aplicado. Ahora:"
echo ""
echo "   git add . && git commit -m \"fix: restaurar getAreaById y tipos en lib/coworking\" && git push origin main"