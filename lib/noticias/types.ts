export type Categoria = "todas" | "eventos" | "tecnologia" | "comunidad" | "general"

export type Noticia = {
  id: number
  titulo: string
  descripcion: string
  contenido?: string
  categoria: Categoria
  tags: string[]
  fecha: string
  autor: string
  slug?: string
  documentId?: string
  covertura?: string
}
