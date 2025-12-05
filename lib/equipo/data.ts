import type { MiembroEquipo } from "./types"

export const miembrosEquipo: MiembroEquipo[] = [
  {
    id: "1",
    slug: "intendente",
    nombre: "Dr. Juan Carlos Pérez",
    cargo: "Intendente",
    area: "Gobierno Municipal",
    foto: "/intendente.jpg",
    bio: "El Intendente lidera el gobierno municipal con una visión de modernización y transformación digital. Con más de 15 años de experiencia en gestión pública, impulsa iniciativas de innovación tecnológica para mejorar la calidad de vida de los ciudadanos.",
    email: "intendente@municipio.gob.ar",
    telefono: "+54 9 11 1234-5678",
    orden: 1,
  },
  {
    id: "2",
    slug: "secretario",
    nombre: "Lic. María González",
    cargo: "Secretaria de Gabinete y Modernización",
    area: "Gabinete y Modernización",
    foto: "/secretaria.jpg",
    bio: "La Secretaria de Gabinete coordina las políticas de modernización del Estado, promoviendo la transformación digital y la innovación en la gestión pública. Especialista en administración pública con enfoque en tecnología.",
    email: "secretaria.gabinete@municipio.gob.ar",
    telefono: "+54 9 11 2345-6789",
    orden: 2,
  },
  {
    id: "3",
    slug: "director-nodo",
    nombre: "Ing. Roberto Fernández",
    cargo: "Director",
    area: "Nodo Tecnológico",
    foto: "/director-tecnologia.jpg",
    bio: "El Director del Nodo Tecnológico lidera el desarrollo de soluciones tecnológicas y la capacitación en habilidades digitales. Ingeniero en Sistemas con amplia experiencia en gestión de proyectos tecnológicos y formación profesional.",
    email: "director.nodo@municipio.gob.ar",
    telefono: "+54 9 11 3456-7890",
    orden: 3,
  },
  {
    id: "4",
    slug: "encargado-laboratorio",
    nombre: "Dr. Carlos Ramírez",
    cargo: "Encargado",
    area: "Laboratorio de Innovación",
    foto: "/encargada-innovacion.jpg",
    bio: "El Encargado del Laboratorio de Innovación fomenta la creatividad y el desarrollo de soluciones innovadoras para desafíos municipales. Doctor en Innovación Tecnológica con especialización en design thinking y metodologías ágiles.",
    email: "laboratorio.innovacion@municipio.gob.ar",
    telefono: "+54 9 11 4567-8901",
    orden: 4,
  },
]

export function getMiembroBySlug(slug: string): MiembroEquipo | undefined {
  return miembrosEquipo.find((miembro) => miembro.slug === slug)
}

export function getAllMiembros(): MiembroEquipo[] {
  return miembrosEquipo.sort((a, b) => a.orden - b.orden)
}
