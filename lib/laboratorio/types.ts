// lib/laboratorio/types.ts
// Coincide exactamente con el schema de laboratorio-back (Prisma).

export type ProjectArea = "DISENO_3D" | "HARDWARE" | "SOFTWARE"

export interface ProjectImage {
  id: string
  projectId: string
  url: string
  alt: string | null
  order: number
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  area: ProjectArea
  coverImage: string | null
  tags: string[]
  content: string | null
  featured: boolean
  order: number
  createdAt: string
  images: ProjectImage[]
}
