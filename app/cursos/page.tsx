import type { Metadata } from "next"
import { CursosClient } from "./cursos-client"

export const metadata: Metadata = {
  title: "Cursos | Nodo Tecnológico Catamarca",
  description: "Explorá la oferta de cursos gratuitos del Nodo Tecnológico de Catamarca.",
}

/**
 * Server Component — solo maneja metadata.
 * La lógica interactiva vive en CursosClient.
 */
export default function CursosPage() {
  return <CursosClient />
}
