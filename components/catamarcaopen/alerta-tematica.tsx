"use client"

// components/catamarcaopen/alerta-tematica.tsx
// Modal informativo que se muestra antes de navegar a "Ver proyectos" o "Publicar proyecto".
// Solo es una maqueta — no bloquea el flujo real, cierra y navega al confirmar.

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Leaf, GraduationCap, Cpu } from "lucide-react"

const CATEGORIAS = [
  {
    icon: Leaf,
    label: "Medioambiente",
    color: "#22c55e",
    bg: "#22c55e1a",
    ejemplos: "reciclaje, energía solar, monitoreo ambiental…",
  },
  {
    icon: GraduationCap,
    label: "Educación",
    color: "#f59e0b",
    bg: "#f59e0b1a",
    ejemplos: "plataformas de aprendizaje, acceso educativo…",
  },
  {
    icon: Cpu,
    label: "Tecnología",
    color: "#26a7fc",
    bg: "#26a7fc1a",
    ejemplos: "software cívico, infraestructura digital…",
  },
]

interface AlertaTematicaProps {
  destino: string
  labelConfirmar?: string
  children: React.ReactNode
}

export function AlertaTematica({
  destino,
  labelConfirmar = "Entendido, continuar",
  children,
}: AlertaTematicaProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  function handleConfirm() {
    setOpen(false)
    router.push(destino)
  }

  return (
    <>
      <span
        onClick={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
        className="contents"
      >
        {children}
      </span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden gap-0">
          <div
            className="px-6 pt-7 pb-5"
            style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)" }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 leading-snug text-balance">
                ¿Tu proyecto está orientado a alguna de estas áreas?
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-muted-foreground text-pretty">
                CatamarcaOpen prioriza repositorios con impacto en la comunidad.
                Los proyectos deben estar enfocados en al menos una de las
                siguientes temáticas:
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-5 space-y-3">
            {CATEGORIAS.map(({ icon: Icon, label, color, bg, ejemplos }) => (
              <div
                key={label}
                className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ backgroundColor: bg }}
              >
                <div
                  className="mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}33` }}
                >
                  <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ejemplos}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 pb-6 flex flex-col gap-2">
            <Button
              onClick={handleConfirm}
              className="w-full text-white rounded-xl"
              style={{ backgroundImage: "linear-gradient(to right, #26a7fc, #1c8fe0)" }}
            >
              {labelConfirmar}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full text-muted-foreground rounded-xl text-sm"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
