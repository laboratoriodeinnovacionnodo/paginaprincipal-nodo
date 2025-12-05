import type { Asiento, EstadoAsiento } from "./types"

const estados: EstadoAsiento[] = ["libre", "ocupado", "fuera-servicio", "limpiando", "compartir", "compartido"]

const imagenes = [
  "/modern-meeting-room.png",
  "/desk-workspace.jpg",
  "/private-office.jpg",
  "/collaborative-workspace.png",
]

const nombres = ["Sala de Reuniones", "Escritorio Individual", "Oficina Privada", "Espacio Colaborativo"]

export const generarAsientos = (): Asiento[] => {
  const asientos: Asiento[] = []

  for (let i = 1; i <= 48; i++) {
    const estadoRandom = estados[Math.floor(Math.random() * estados.length)]
    const imagenIndex = (i - 1) % imagenes.length
    asientos.push({
      id: `asiento-${i}`,
      numero: i,
      estado: estadoRandom,
      notificaciones: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : undefined,
      imagen: imagenes[imagenIndex],
      nombre: `${nombres[imagenIndex]} ${i}`,
    })
  }

  return asientos
}
