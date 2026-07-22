// lib/catamarcaopen/data.ts
// Datos MOCK para validar el diseño antes de conectar catamarcaopen-back.
// Ver lib/catamarcaopen/api.ts para el punto de reemplazo por datos reales.

import type { Project, Review } from "./types"

export const MOCK_PROJECTS: Project[] = [
  {
    id: "turnos-municipales",
    title: "Sistema de Turnos Municipales",
    description:
      "Gestión de turnos para trámites del municipio, con recordatorios automáticos por email y panel de administración para las distintas áreas.",
    stack: ["NestJS", "Prisma", "PostgreSQL"],
    category: "Trámites digitales",
    repoUrl: "https://github.com/nodo-catamarca/turnos-municipales",
    status: "aprobado",
    authorName: "Julián Ibáñez",
    rating: 4.5,
    reviewsCount: 12,
    createdAt: "2026-03-10T00:00:00.000Z",
  },
  {
    id: "reciclaje-barrial",
    title: "App de Reciclaje Barrial",
    description: "Aplicación para reportar puntos de reciclaje y coordinar retiros con vecinos de cada barrio.",
    stack: ["React Native", "Expo"],
    category: "Medio ambiente",
    repoUrl: "https://github.com/nodo-catamarca/reciclaje-barrial",
    status: "en_revision",
    authorName: "Camila Torres",
    rating: 4.0,
    reviewsCount: 6,
    createdAt: "2026-05-02T00:00:00.000Z",
  },
  {
    id: "mapa-de-baches",
    title: "Mapa de Baches",
    description: "Mapa colaborativo para reportar baches en la vía pública y hacer seguimiento del arreglo.",
    stack: ["Next.js", "Leaflet"],
    category: "Infraestructura",
    repoUrl: "https://github.com/nodo-catamarca/mapa-de-baches",
    status: "aprobado",
    authorName: "Franco Díaz",
    rating: 4.8,
    reviewsCount: 20,
    createdAt: "2026-01-20T00:00:00.000Z",
  },
]

export const MOCK_REVIEWS: Record<string, Review[]> = {
  "turnos-municipales": [
    {
      id: "r1",
      projectId: "turnos-municipales",
      authorName: "Marcos Herrera",
      rating: 5,
      comment: "Muy prolijo el código, faltaría agregar tests para los endpoints de turnos.",
      createdAt: "2026-03-15T00:00:00.000Z",
    },
    {
      id: "r2",
      projectId: "turnos-municipales",
      authorName: "Lucía Núñez",
      rating: 4,
      comment: "Funciona bien en el ambiente de pruebas, buena documentación del repo.",
      createdAt: "2026-03-20T00:00:00.000Z",
    },
  ],
  "reciclaje-barrial": [
    {
      id: "r3",
      projectId: "reciclaje-barrial",
      authorName: "Pedro Gómez",
      rating: 4,
      comment: "Buena idea, falta soporte offline para zonas sin señal.",
      createdAt: "2026-05-10T00:00:00.000Z",
    },
  ],
  "mapa-de-baches": [
    {
      id: "r4",
      projectId: "mapa-de-baches",
      authorName: "Sofía Ruiz",
      rating: 5,
      comment: "Lo usamos en el barrio y ya se arreglaron dos baches gracias al mapa.",
      createdAt: "2026-01-25T00:00:00.000Z",
    },
  ],
}
