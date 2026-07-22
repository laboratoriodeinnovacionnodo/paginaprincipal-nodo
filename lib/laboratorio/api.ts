// lib/laboratorio/api.ts
//
// Conecta DE VERDAD contra laboratorio-back (no mock). El backend ya expone
// estos endpoints públicos, sin necesidad de autenticación:
//   GET /projects/public?area=...   -> solo status=PUBLISHED, ordenado por
//                                      featured desc, order asc, createdAt desc
//   GET /projects/public/:slug      -> detalle con galería de imágenes
//
// Requisito de infraestructura (fuera de este script): habilitar CORS en
// laboratorio-back para el dominio de ciudadano-front (CORS_ORIGINS en su
// .env de despliegue).

import type { Project, ProjectArea } from "./types"

const API_URL = process.env.NEXT_PUBLIC_LABORATORIO_API_URL ?? "https://api.laboratorio.nodo.cc.gob.ar/api/v1"

export async function getProjects(area?: ProjectArea): Promise<Project[]> {
  try {
    const query = area ? `?area=${area}` : ""
    const res = await fetch(`${API_URL}/projects/public${query}`, { cache: "no-store" })

    if (!res.ok) {
      throw new Error(`Error al obtener proyectos: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("[laboratorio] Error en getProjects:", error)
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_URL}/projects/public/${slug}`, { cache: "no-store" })

    if (res.status === 404) return null
    if (!res.ok) {
      throw new Error(`Error al obtener el proyecto: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("[laboratorio] Error en getProjectBySlug:", error)
    return null
  }
}
