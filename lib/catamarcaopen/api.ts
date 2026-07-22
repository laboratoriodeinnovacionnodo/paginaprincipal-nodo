// lib/catamarcaopen/api.ts
//
// Capa de datos de CatamarcaOpen.
//
// Estado actual: MOCK (usa lib/catamarcaopen/data.ts). Cada función ya trae,
// comentado debajo, el fetch real contra catamarcaopen-back — mismo shape
// que lib/graduados/api.ts — para descomentar cuando:
//   1. catamarcaopen-back habilite CORS para el dominio de ciudadano-front.
//   2. Se defina NEXT_PUBLIC_CATAMARCAOPEN_API_URL (ver .env.local.example).
//   3. Se unifique el proyecto de Firebase con el que ya valida
//      catamarcaopen-back (mismo login para ambos módulos).

import type { Project, Review, NewProjectInput } from "./types"
import { MOCK_PROJECTS, MOCK_REVIEWS } from "./data"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const API_URL = process.env.NEXT_PUBLIC_CATAMARCAOPEN_API_URL ?? "https://api.catamarcaopen.nodo.cc.gob.ar/api/v1"

function simulateNetworkDelay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getProjects(): Promise<Project[]> {
  await simulateNetworkDelay()
  return MOCK_PROJECTS

  // Real:
  // const res = await fetch(`${API_URL}/projects`, { cache: "no-store" })
  // if (!res.ok) throw new Error(`Error al obtener proyectos: ${res.status}`)
  // return res.json()
}

export async function getProjectById(id: string): Promise<Project | null> {
  await simulateNetworkDelay()
  return MOCK_PROJECTS.find((p) => p.id === id) ?? null

  // Real:
  // const res = await fetch(`${API_URL}/projects/${id}`, { cache: "no-store" })
  // if (res.status === 404) return null
  // if (!res.ok) throw new Error(`Error al obtener el proyecto: ${res.status}`)
  // return res.json()
}

export async function getProjectReviews(projectId: string): Promise<Review[]> {
  await simulateNetworkDelay(250)
  return MOCK_REVIEWS[projectId] ?? []

  // Real:
  // const res = await fetch(`${API_URL}/projects/${projectId}/reviews`, { cache: "no-store" })
  // if (!res.ok) throw new Error(`Error al obtener revisiones: ${res.status}`)
  // return res.json()
}

export async function submitProject(input: NewProjectInput, idToken: string): Promise<Project> {
  await simulateNetworkDelay(600)

  const created: Project = {
    id: input.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    title: input.title,
    description: input.description,
    stack: [],
    category: input.category,
    repoUrl: input.repoUrl,
    status: "en_revision",
    authorName: "Vos",
    rating: 0,
    reviewsCount: 0,
    createdAt: new Date().toISOString(),
  }

  MOCK_PROJECTS.unshift(created)
  return created

  // Real:
  // const res = await fetch(`${API_URL}/projects`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
  //   body: JSON.stringify(input),
  // })
  // if (!res.ok) throw new Error(`Error al publicar el proyecto: ${res.status}`)
  // return res.json()
}
