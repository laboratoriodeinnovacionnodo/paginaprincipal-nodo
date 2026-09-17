/**
 * lib/coworking/area-images.ts
 *
 * Mapea la letra de zona (extraída del nombre del área: A1→"A") a su imagen.
 * Las fotos van en public/areas/
 * Mismo criterio que coworking-front.
 */
export const ZONA_IMAGES: Record<string, string> = {
  A: "/areas/zona-a.jpeg",
  B: "/areas/zona-b.jpeg",
  C: "/areas/zona-c.jpeg",
}

export const ZONA_LABELS: Record<string, string> = {
  A: "Zona A",
  B: "Zona B",
  C: "Zona C",
}

/** Extrae la letra de zona del nombre del área (ej: "A1" → "A", "B5" → "B") */
export function getZonaLetra(nombreArea: string): string {
  const match = nombreArea.match(/^([A-Za-z]+)/)
  return match ? match[1].toUpperCase() : "A"
}

export function getZonaImage(letra: string): string | null {
  return ZONA_IMAGES[letra] ?? null
}

export function getZonaLabel(letra: string): string {
  return ZONA_LABELS[letra] ?? `Zona ${letra}`
}
