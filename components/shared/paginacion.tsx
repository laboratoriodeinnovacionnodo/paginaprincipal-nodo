"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginacionProps = {
  paginaActual: number
  totalPaginas: number
  onPaginaChange: (pagina: number) => void
}

export function Paginacion({ paginaActual, totalPaginas, onPaginaChange }: PaginacionProps) {
  if (totalPaginas <= 1) return null

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPaginaChange(Math.max(paginaActual - 1, 1))}
        disabled={paginaActual === 1}
        className="bg-white/70 backdrop-blur-sm"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
          <Button
            key={pagina}
            variant={paginaActual === pagina ? "default" : "outline"}
            size="sm"
            onClick={() => onPaginaChange(pagina)}
            className={paginaActual === pagina ? "bg-[#26a7fc] hover:bg-[#1c8fe0]" : "bg-white/70 backdrop-blur-sm"}
          >
            {pagina}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPaginaChange(Math.min(paginaActual + 1, totalPaginas))}
        disabled={paginaActual === totalPaginas}
        className="bg-white/70 backdrop-blur-sm"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
