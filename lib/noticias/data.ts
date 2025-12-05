import type { Noticia } from "./types"

export const noticias: Noticia[] = [
  {
    id: 1,
    titulo: "Evento de Desarrollo Web",
    descripcion: "Un evento para desarrolladores web",
    categoria: "eventos",
    tags: ["Web Development", "JavaScript"],
    fecha: "2023-10-01",
    autor: "Juan Pérez",
  },
  {
    id: 2,
    titulo: "Nuevas Tecnologías",
    descripcion: "Una revisión de las últimas tecnologías en el mercado",
    categoria: "tecnologia",
    tags: ["Python", "AI"],
    fecha: "2023-09-15",
    autor: "María García",
  },
  {
    id: 3,
    titulo: "Noticia de Comunidad",
    descripcion: "Una noticia sobre la comunidad de tecnología",
    categoria: "comunidad",
    tags: ["Networking", "Open Source"],
    fecha: "2023-09-20",
    autor: "Carlos López",
  },
  {
    id: 4,
    titulo: "Conferencia de Diseño UX/UI",
    descripcion: "Una conferencia sobre diseño de experiencias de usuario",
    categoria: "eventos",
    tags: ["UX/UI", "Figma"],
    fecha: "2023-10-10",
    autor: "Ana Martínez",
  },
  {
    id: 5,
    titulo: "Actualizaciones en Marketing Digital",
    descripcion: "Estrategias de marketing en el mundo digital",
    categoria: "tecnologia",
    tags: ["Marketing", "SEO"],
    fecha: "2023-09-25",
    autor: "Luis Rodríguez",
  },
  {
    id: 6,
    titulo: "Nueva Publicación en Comunidad",
    descripcion: "Una publicación sobre la comunidad de seguridad informática",
    categoria: "comunidad",
    tags: ["Seguridad", "Ciberseguridad"],
    fecha: "2023-09-30",
    autor: "Laura Hernández",
  },
]

export const tagsByCategoria = {
  eventos: ["Web Development", "JavaScript", "UX/UI", "Figma"],
  tecnologia: ["Python", "AI", "Marketing", "SEO"],
  comunidad: ["Networking", "Open Source", "Seguridad", "Ciberseguridad"],
}
