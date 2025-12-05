import type { Curso } from "./types"

export const cursos: Curso[] = [
  {
    id: 1,
    titulo: "Desarrollo Web Full Stack",
    descripcion: "Aprende a crear aplicaciones web completas con tecnologías modernas",
    modalidad: "presencial",
    tags: ["Programación", "Web Development", "JavaScript"],
    duracion: "6 meses",
    cupo: 25,
    ubicacion: "Nodo Tecnológico - Catamarca",
  },
  {
    id: 2,
    titulo: "Introducción a Python",
    descripcion: "Curso básico de programación en Python para principiantes",
    modalidad: "virtual",
    tags: ["Programación", "Python", "Básico"],
    duracion: "3 meses",
    cupo: 50,
  },
  {
    id: 3,
    titulo: "Data Science y Machine Learning",
    descripcion: "Análisis de datos y algoritmos de aprendizaje automático",
    modalidad: "presencial",
    tags: ["Data Science", "IA", "Python"],
    duracion: "8 meses",
    cupo: 20,
    ubicacion: "Nodo Tecnológico - Catamarca",
  },
  {
    id: 4,
    titulo: "Diseño UX/UI",
    descripcion: "Diseña experiencias de usuario excepcionales",
    modalidad: "virtual",
    tags: ["Diseño", "UX/UI", "Figma"],
    duracion: "4 meses",
    cupo: 30,
  },
  {
    id: 5,
    titulo: "Marketing Digital",
    descripcion: "Estrategias de marketing en el mundo digital",
    modalidad: "presencial",
    tags: ["Marketing", "Redes Sociales", "SEO"],
    duracion: "5 meses",
    cupo: 30,
    ubicacion: "Nodo Tecnológico - Catamarca",
  },
  {
    id: 6,
    titulo: "Ciberseguridad Básica",
    descripcion: "Fundamentos de seguridad informática y protección de datos",
    modalidad: "virtual",
    tags: ["Seguridad", "Networking", "Ciberseguridad"],
    duracion: "3 meses",
    cupo: 40,
  },
]

export const tagsByModalidad = {
  presencial: ["Programación", "Web Development", "Data Science", "IA", "Marketing", "Diseño"],
  virtual: ["Programación", "Python", "Diseño", "UX/UI", "Seguridad", "Ciberseguridad"],
}

export const cursosDisponibles = cursos.map((curso) => curso.titulo)
