import type { StrapiResponse, StrapiCursoPresencial, StrapiCursoVirtual, StrapiNoticia, StrapiTag } from "./types"
import type { Curso } from "@/lib/cursos/types"
import type { Noticia } from "@/lib/noticias/types"

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1338/api"

async function fetchStrapi<T>(endpoint: string): Promise<StrapiResponse<T>> {
  try {
    console.log("[v0] Fetching from Strapi:", `${STRAPI_API_URL}${endpoint}`)
    const response = await fetch(`${STRAPI_API_URL}${endpoint}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error fetching from Strapi: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Strapi response:", data)
    return data
  } catch (error) {
    console.error(`[v0] Error fetching ${endpoint}:`, error)
    return { data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } }
  }
}

function extractTextFromDescription(descripcion: any): string {
  if (!descripcion) return "Sin descripción disponible"

  if (typeof descripcion === "string") return descripcion

  if (Array.isArray(descripcion)) {
    return descripcion
      .map((block: any) => {
        if (block.children && Array.isArray(block.children)) {
          return block.children.map((child: any) => child.text || "").join("")
        }
        return ""
      })
      .join(" ")
      .trim()
  }

  return "Sin descripción disponible"
}

function extractRequisitosFromList(requisitos: any): string[] {
  if (!requisitos) return []

  if (Array.isArray(requisitos)) {
    const items: string[] = []
    requisitos.forEach((block: any) => {
      if (block.children && Array.isArray(block.children)) {
        block.children.forEach((listItem: any) => {
          if (listItem.children && Array.isArray(listItem.children)) {
            const text = listItem.children.map((child: any) => child.text || "").join("")
            if (text.trim()) items.push(text.trim())
          }
        })
      }
    })
    return items
  }

  return []
}

function deriveTags(item: StrapiCursoPresencial | StrapiCursoVirtual): string[] {
  const tags: string[] = []

  if (item.edad) tags.push(item.edad)
  if (item.duracion) tags.push(item.duracion)
  if (item.turno) tags.push(item.turno)

  return tags
}

export async function getTags(): Promise<string[]> {
  const response = await fetchStrapi<StrapiTag>("/tags")
  return response.data.map((tag) => tag.nombre)
}

export async function getCursosPresenciales(): Promise<Curso[]> {
  const response = await fetchStrapi<StrapiCursoPresencial>("/curso-presencials?populate=tags")

  return response.data.map((item) => ({
    id: `presencial-${item.id}`,
    titulo: item.titulo,
    descripcion: extractTextFromDescription(item.descripcion),
    modalidad: "presencial" as const,
    tags: item.tags?.map((tag) => tag.nombre) || [],
    duracion: item.duracion || "Por definir",
    cupo: 30,
    ubicacion: "Nodo Tecnológico",
    link: item.link,
    edad: item.edad,
    turno: item.turno,
    publicadoEnFecha: item.publicadoEnFecha,
    slug: item.slug,
    documentId: item.documentId,
    requisitos: extractRequisitosFromList(item.requisitos),
    cupos: item.cupos,
  }))
}

export async function getCursosVirtuales(): Promise<Curso[]> {
  const response = await fetchStrapi<StrapiCursoVirtual>("/curso-virtuals?populate=tags")

  return response.data.map((item) => ({
    id: `virtual-${item.id}`,
    titulo: item.titulo,
    descripcion: extractTextFromDescription(item.descripcion),
    modalidad: "virtual" as const,
    tags: item.tags?.map((tag) => tag.nombre) || [],
    duracion: item.duracion || "Por definir",
    cupo: 50,
    link: item.link,
    edad: item.edad,
    turno: item.turno,
    publicadoEnFecha: item.publicadoEnFecha,
    slug: item.slug,
    documentId: item.documentId,
    requisitos: extractRequisitosFromList(item.requisitos),
    cupos: item.cupos,
  }))
}

export async function getTodosCursos(): Promise<Curso[]> {
  const [presenciales, virtuales] = await Promise.all([getCursosPresenciales(), getCursosVirtuales()])
  return [...presenciales, ...virtuales]
}

export async function getCursoBySlug(slug: string): Promise<Curso | null> {
  const [presenciales, virtuales] = await Promise.all([getCursosPresenciales(), getCursosVirtuales()])
  const todosCursos = [...presenciales, ...virtuales]
  return todosCursos.find((curso) => curso.slug === slug) || null
}

function deriveTagsFromTitulo(titulo: string): string[] {
  const tituloLower = titulo.toLowerCase()
  const tags: string[] = []

  if (tituloLower.includes("programacion") || tituloLower.includes("fullstack")) tags.push("Programación")
  if (tituloLower.includes("curso")) tags.push("Curso")
  if (tituloLower.includes("taller")) tags.push("Taller")
  if (tituloLower.includes("evento")) tags.push("Evento")
  if (tituloLower.includes("graduacion")) tags.push("Graduación")

  return tags.length > 0 ? tags : ["General"]
}

export async function getNoticias(): Promise<Noticia[]> {
  const response = await fetchStrapi<StrapiNoticia>("/noticias?populate=*")

  return response.data.map((item) => ({
    id: item.id,
    titulo: item.titulo,
    descripcion: item.contenido?.substring(0, 150) + "..." || "Sin descripción disponible",
    contenido: item.contenido || "",
    categoria: "general" as const,
    tags: item.tags?.map((tag) => tag.nombre) || [],
    fecha: item.publicadoEnFecha || new Date(item.createdAt).toISOString().split("T")[0],
    autor: "Nodo Tecnológico",
    slug: item.slug,
    documentId: item.documentId,
    covertura: item.covertura?.[0] ? `${STRAPI_API_URL.replace("/api", "")}${item.covertura[0].url}` : undefined,
  }))
}

export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  const noticias = await getNoticias()
  return noticias.find((noticia) => noticia.slug === slug) || null
}
