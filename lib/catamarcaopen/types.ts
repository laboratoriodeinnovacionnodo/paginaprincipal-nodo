// lib/catamarcaopen/types.ts

export type ProjectStatus = "aprobado" | "en_revision" | "rechazado"

export interface Project {
  id: string
  title: string
  description: string
  stack: string[]
  category: string
  repoUrl: string
  status: ProjectStatus
  authorName: string
  rating: number
  reviewsCount: number
  createdAt: string
}

export interface Review {
  id: string
  projectId: string
  authorName: string
  rating: number
  comment: string
  createdAt: string
}

export interface NewProjectInput {
  title: string
  description: string
  category: string
  repoUrl: string
}
