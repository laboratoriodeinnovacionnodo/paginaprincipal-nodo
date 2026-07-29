#!/usr/bin/env bash
# =============================================================================
# fix-cursos-card-click-profe-ia.sh — ciudadano-front
# - Card completa de curso clickeable → /cursos/[slug]
# - Botón "Inscribirme" → registro externo (stopPropagation)
# - Nuevo botón "Aprender con el Profe IA" → https://profe.nodo.cc.gob.ar (stopPropagation)
# Ejecutar desde la raíz del repo ciudadano-front: bash fix-cursos-card-click-profe-ia.sh
# =============================================================================
set -euo pipefail

mkdir -p components/cursos

# -----------------------------------------------------------------------------
# components/cursos/curso-card-nodo.tsx (nuevo, client component)
# -----------------------------------------------------------------------------
echo "♻️  Creando components/cursos/curso-card-nodo.tsx..."

cat > components/cursos/curso-card-nodo.tsx << 'EOF'
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
      className="flex flex-col overflow-hidden border border-cyan-100 bg-white/80 backdrop-blur-sm transition-shadow hover:shadow-md cursor-pointer"
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
            <Clock className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
            <span>{curso.duration}</span>
          </div>
          {curso.maxParticipants && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
              <span>{curso.maxParticipants} cupos</span>
            </div>
          )}
          {aulaLabel && (
            <div className="flex items-center gap-1.5 col-span-2">
              <MapPin className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
              <span>{aulaLabel}</span>
            </div>
          )}
          {(curso.horaInicio || curso.fechaInicio) && (
            <div className="flex items-center gap-1.5 col-span-2">
              <CalendarDays className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
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
              <BookOpen className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
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
          <Button asChild size="sm" className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700 text-white" onClick={stop}>
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
          className="w-full gap-2 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800"
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
EOF

# -----------------------------------------------------------------------------
# app/cursos/page.tsx — usar el nuevo componente, sacar CursoCard local
# -----------------------------------------------------------------------------
echo "♻️  Regenerando app/cursos/page.tsx..."

cat > app/cursos/page.tsx << 'EOF'
// app/cursos/page.tsx — Server Component
import type { Metadata } from 'next'
import { getCursos } from '@/lib/cursos/api'
import type { CursoBack } from '@/lib/cursos/types'
import { CursoCardNodo } from '@/components/cursos/curso-card-nodo'

export const metadata: Metadata = {
  title: 'Cursos | Nodo Tecnológico Catamarca',
  description: 'Explorá la oferta de cursos gratuitos del Nodo Tecnológico de Catamarca.',
}

export default async function CursosPage() {
  let cursos: CursoBack[] = []
  let error = false
  try {
    const data = await getCursos({ limit: 100 })
    cursos = data.items.filter((c) => c.available).sort((a, b) => a.order - b.order)
  } catch { error = true }

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-blue-50">
      <section className="relative overflow-hidden pt-24 pb-10">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-600">Formación gratuita</p>
          <h1 className="mb-4 text-4xl font-bold text-balance md:text-5xl">Nuestros <span className="text-cyan-500">Cursos</span></h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground text-pretty leading-relaxed">
            Aprendé tecnología con el equipo del Nodo Tecnológico de Catamarca. Todos los cursos son gratuitos.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 pb-24">
        {error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-600">No pudimos cargar los cursos. Intentá de nuevo más tarde.</p>
          </div>
        ) : cursos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🎓</span>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Pronto habrá nuevos cursos</h2>
            <p className="text-sm text-muted-foreground max-w-xs">Estamos preparando la próxima oferta formativa.</p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">{cursos.length} curso{cursos.length !== 1 ? 's' : ''} disponible{cursos.length !== 1 ? 's' : ''}</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cursos.map((curso) => <CursoCardNodo key={curso.id} curso={curso} />)}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
EOF

# -----------------------------------------------------------------------------
# app/cursos/[id]/page.tsx — agregar botón "Aprender con el Profe IA" en detalle
# -----------------------------------------------------------------------------
echo "♻️  Agregando botón Profe IA en app/cursos/[id]/page.tsx..."

if ! grep -q 'profe.nodo.cc.gob.ar' 'app/cursos/[id]/page.tsx'; then
  perl -0777 -pi -e "s|(import \{ Card, CardContent, CardHeader, CardTitle \} from '\@/components/ui/card'\n)|\$1import { buildInscripcionUrl } from '\@/lib/cursos/registro-url'\n|" 'app/cursos/[id]/page.tsx' 2>/dev/null || true

  perl -0777 -pi -e "s|(<Clock className=\"h-4 w-4\" /> Sparkles)||" 'app/cursos/[id]/page.tsx' 2>/dev/null || true

  # Insertar import de Sparkles en la línea de lucide-react
  sed -i "s/CheckCircle2 } from 'lucide-react'/CheckCircle2, Sparkles } from 'lucide-react'/" 'app/cursos/[id]/page.tsx'

  # Insertar el botón justo después del botón/bloque de WhatsApp (o antes del cierre del bloque de acciones)
  perl -0777 -pi -e 's|(\{curso\.whatsappLink && \(\s*<Button asChild size="sm" variant="ghost" className="w-full text-green-700 hover:text-green-800 hover:bg-green-50">\s*<a href=\{curso\.whatsappLink\} target="_blank" rel="noopener noreferrer">Grupo de WhatsApp</a>\s*</Button>\s*\)\})|$1\n                  <Button asChild size="sm" variant="outline" className="w-full gap-2 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800">\n                    <a href="https://profe.nodo.cc.gob.ar" target="_blank" rel="noopener noreferrer">\n                      <Sparkles className="h-4 w-4" />\n                      Aprender con el Profe IA\n                    </a>\n                  </Button>|s' 'app/cursos/[id]/page.tsx'

  echo "   → botón agregado"
else
  echo "   → ya existía referencia a profe.nodo.cc.gob.ar, no se toca"
fi

echo ""
echo "✅ Listo:"
echo "   - Card de /cursos ahora es clickeable completa → /cursos/[slug]"
echo "   - Botón Inscribirme sigue yendo al registro externo (stopPropagation)"
echo "   - Nuevo botón 'Aprender con el Profe IA' → https://profe.nodo.cc.gob.ar (stopPropagation)"
echo "   - Mismo botón agregado también en el detalle del curso"
echo ""
echo "⚠️  Revisar manualmente:"
echo "   - Verificar que el regex del detalle insertó bien el botón (buscar 'profe.nodo.cc.gob.ar' en el archivo)"
echo "   - Si el curso NO tiene whatsappLink, el botón Profe IA en el detalle no se insertará: revisar y agregar a mano ese caso si aplica"
echo ""
echo "▶️  Corré 'pnpm build' antes de deployar para confirmar que compila limpio."