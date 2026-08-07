"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Clock, Users, MapPin, CalendarDays, ExternalLink, BookOpen, Sparkles } from "lucide-react"
import type { CursoBack } from "@/lib/cursos/types"
import { tieneInscripcionActiva, NIVEL_LABEL, AULA_NOMBRE } from "@/lib/cursos/types"
import { buildInscripcionUrl } from "@/lib/cursos/registro-url"

const PROFE_IA_URL = "https://profe.nodo.cc.gob.ar"

const NIVEL_COLOR: Record<string, string> = {
  PRINCIPIANTE: "bg-green-100 text-green-800 border-green-200",
  INTERMEDIO: "bg-amber-100 text-amber-800 border-amber-200",
  AVANZADO: "bg-red-100 text-red-800 border-red-200",
}

export function CursoCardNodo({ curso }: { curso: CursoBack }) {
  const router = useRouter()
  const puedeInscribirse = tieneInscripcionActiva(curso) && curso.available
  const aulaLabel = curso.aula ? AULA_NOMBRE[curso.aula] : null

  const irAlDetalle = () => {
    router.push(`/cursos/${curso.slug}`)
  }

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Card
      onClick={irAlDetalle}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") irAlDetalle()
      }}
      className="flex flex-col overflow-hidden border border-[#26a7fc]/10 bg-white/80 backdrop-blur-sm transition-shadow hover:shadow-md cursor-pointer"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none">{curso.emoji || "📚"}</span>
            <div>
              <h2 className="text-lg font-bold leading-tight text-gray-900 text-balance">{curso.title}</h2>
              {curso.profe && <p className="mt-0.5 text-xs text-muted-foreground">{curso.profe.nombre}</p>}
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
              NIVEL_COLOR[curso.level] ?? "bg-gray-100 text-gray-800"
            }`}
          >
            {NIVEL_LABEL[curso.level] ?? curso.level}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 text-pretty">
          {curso.description}
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#26a7fc] shrink-0" />
            <span>{curso.duration}</span>
          </div>
          {curso.maxParticipants && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#26a7fc] shrink-0" />
              <span>{curso.maxParticipants} cupos</span>
            </div>
          )}
          {aulaLabel && (
            <div className="flex items-center gap-1.5 col-span-2">
              <MapPin className="h-3.5 w-3.5 text-[#26a7fc] shrink-0" />
              <span>{aulaLabel}</span>
            </div>
          )}
          {(curso.horaInicio || curso.fechaInicio) && (
            <div className="flex items-center gap-1.5 col-span-2">
              <CalendarDays className="h-3.5 w-3.5 text-[#26a7fc] shrink-0" />
              <span>
                {curso.fechaInicio &&
                  new Date(curso.fechaInicio).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                {curso.horaInicio && curso.horaFin && ` · ${curso.horaInicio}–${curso.horaFin} hs`}
              </span>
            </div>
          )}
          {curso.modules > 0 && (
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#26a7fc] shrink-0" />
              <span>{curso.modules} módulos</span>
            </div>
          )}
        </div>
        {curso.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {curso.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-cyan-50 pt-4">
        {puedeInscribirse ? (
          <Button asChild size="sm" className="w-full gap-2 bg-[#1c8fe0] hover:bg-[#1c8fe0] text-white" onClick={stop}>
            <a href={buildInscripcionUrl(curso.slug)} target="_blank" rel="noopener noreferrer" onClick={stop}>
              <ExternalLink className="h-3.5 w-3.5" />
              Inscribirme
            </a>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            disabled
            className="w-full cursor-not-allowed opacity-60"
            onClick={stop}
          >
            {curso.waitlistEnabled ? "Lista de espera" : "Sin inscripción activa"}
          </Button>
        )}

        <Button
          asChild
          size="sm"
          variant="outline"
          className="w-full gap-2 border-[#26a7fc]/20 text-[#1c8fe0] hover:bg-[#26a7fc]/10 hover:text-cyan-800"
          onClick={stop}
        >
          <a href={PROFE_IA_URL} target="_blank" rel="noopener noreferrer" onClick={stop}>
            <Sparkles className="h-3.5 w-3.5" />
            Aprender con el Profe IA
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
