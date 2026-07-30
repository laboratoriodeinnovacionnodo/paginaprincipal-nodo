#!/usr/bin/env bash
# =============================================================================
# sso-ciudadano-front-cursos.sh
# ciudadano-front — Reemplazar link estático a registro por botón con SSO
#
# QUÉ HACE:
#   - Actualiza app/cursos/[slug]/page.tsx:
#     El <a href={registroUrl}> estático se reemplaza por InscribirseButton
#     que obtiene el idToken de Firebase y redirige con ?ctoken=TOKEN
#
#   - Actualiza components/cursos/cursos-content.tsx:
#     Si tiene botones de inscripción los convierte también
#
#   - Crea lib/registro-link.ts si no existe
#   - Crea components/cursos/inscribirse-button.tsx si no existe
# =============================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${YELLOW}▶ $*${NC}"; }
ok()   { echo -e "${GREEN}✅ $*${NC}"; }
warn() { echo -e "${RED}⚠  $*${NC}"; }
sep()  { echo -e "${GREEN}──────────────────────────────────────────${NC}"; }

if [[ ! -f "next.config.ts" && ! -f "next.config.js" && ! -f "next.config.mjs" && ! -d "app" ]]; then
  warn "Ejecutar desde la raíz de ciudadano-front"
  exit 1
fi

sep
echo -e "${GREEN}ciudadano-front — SSO en botones de inscripción${NC}"
sep

# ── 1. lib/registro-link.ts ───────────────────────────────────────────────────
log "Creando/actualizando lib/registro-link.ts..."

cat > lib/registro-link.ts << 'TS_END'
/**
 * lib/registro-link.ts
 *
 * Construye la URL de registro-front con ?ctoken=<Firebase idToken>
 * para SSO silencioso — registro-front reconoce al ciudadano sin pedirle login.
 */
import type { User } from "firebase/auth"

const REGISTRO_BASE =
  (process.env.NEXT_PUBLIC_REGISTRO_URL ?? "").replace(/\/$/, "")

/**
 * Async — usar en onClick de botones de inscripción.
 * Obtiene un token fresco y construye la URL completa.
 */
export async function buildRegistroUrl(slug: string, user: User | null): Promise<string> {
  const base = `${REGISTRO_BASE}/preinscripciones/${slug}`
  if (!user || !REGISTRO_BASE) return base
  try {
    const token = await user.getIdToken(true)
    return `${base}?ctoken=${encodeURIComponent(token)}`
  } catch {
    return base
  }
}
TS_END

ok "lib/registro-link.ts listo"

# ── 2. components/cursos/inscribirse-button.tsx ───────────────────────────────
log "Creando components/cursos/inscribirse-button.tsx..."
mkdir -p components/cursos

cat > components/cursos/inscribirse-button.tsx << 'TSX_END'
"use client"

/**
 * InscribirseButton
 *
 * Reemplaza el <a href={registroUrl}> estático.
 * Obtiene el idToken de Firebase, construye la URL con ?ctoken y redirige.
 * Si el usuario NO está logueado, redirige igual sin token.
 *
 * Uso:
 *   <InscribirseButton
 *     slug="preinscripcion-robot-basico"
 *     className="..."
 *   >
 *     Inscribirme
 *   </InscribirseButton>
 */

import { useState, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { buildRegistroUrl } from "@/lib/registro-link"

interface Props {
  slug:       string
  className?: string
  children?:  React.ReactNode
}

export function InscribirseButton({ slug, className = "", children }: Props) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setLoading(true)
    try {
      const url = await buildRegistroUrl(slug, user)
      window.location.href = url
    } catch {
      const base = (process.env.NEXT_PUBLIC_REGISTRO_URL ?? "").replace(/\/$/, "")
      window.location.href = `${base}/preinscripciones/${slug}`
    } finally {
      setLoading(false)
    }
  }, [slug, user])

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? "Redirigiendo..." : (children ?? "Inscribirme")}
    </button>
  )
}
TSX_END

ok "components/cursos/inscribirse-button.tsx listo"

# ── 3. Buscar y actualizar la página de detalle del curso ─────────────────────
# ciudadano-front tiene app/cursos/[slug]/page.tsx con <a href={registroUrl}>

DETALLE_PAGE=""
for p in \
  "app/cursos/[slug]/page.tsx" \
  "app/(public)/cursos/[slug]/page.tsx" \
  "app/cursos/[id]/page.tsx"; do
  if [[ -f "$p" ]]; then
    DETALLE_PAGE="$p"
    break
  fi
done

if [[ -z "$DETALLE_PAGE" ]]; then
  warn "No se encontró la página de detalle del curso. Archivos en app/cursos/:"
  find app -name "page.tsx" | grep -i curso | head -10 || true
  warn "Editá manualmente el botón de inscripción usando InscribirseButton"
else
  log "Encontrada: $DETALLE_PAGE"
  cp "$DETALLE_PAGE" "${DETALLE_PAGE}.bak.$(date +%Y%m%d_%H%M%S)"

  # Verificar si ya tiene el patrón <a href={registroUrl}
  if grep -q 'href={registroUrl}' "$DETALLE_PAGE"; then
    log "Encontrado patrón href={registroUrl} — reemplazando con InscribirseButton..."

    # Leer el contenido del archivo
    node - << JSEOF
const fs = require('fs')
const file = '${DETALLE_PAGE}'
let content = fs.readFileSync(file, 'utf8')

// 1. Agregar import de InscribirseButton si no está
if (!content.includes('InscribirseButton')) {
  // Buscar la última línea de imports para agregar después
  const importMatch = content.match(/(import[^;]+;[\s]*)([\s\S]*)/m)
  if (importMatch) {
    // Insertar después del último import
    const lastImportEnd = content.lastIndexOf("import ")
    const lineEnd = content.indexOf('\n', lastImportEnd)
    const insertPos = lineEnd + 1
    content = content.slice(0, insertPos)
      + "import { InscribirseButton } from '@/components/cursos/inscribirse-button'\n"
      + content.slice(insertPos)
    console.log('OK: import InscribirseButton agregado')
  }
}

// 2. Reemplazar el bloque <a href={registroUrl} ...> ... </a>
// Patrón: {registroUrl && ( <a href={registroUrl} ...> <Button ...>texto</Button> </a> )}
const oldPattern = /{registroUrl && \([\s\S]*?<a href={registroUrl}[\s\S]*?<\/a>[\s\S]*?\)}/
const hasPattern = oldPattern.test(content)

if (hasPattern) {
  content = content.replace(oldPattern, \`{registroUrl && (
          <InscribirseButton
            slug={registroModule?.slug ?? ''}
            className="gap-2 rounded-xl text-xs px-3 py-2 border border-[#26a7fc]/30 text-[#26a7fc] hover:bg-[#26a7fc]/5 font-semibold"
          >
            Inscribirme
          </InscribirseButton>
        )}\`)
  console.log('OK: bloque <a href> reemplazado con InscribirseButton')
} else {
  // Intentar reemplazo más simple: solo la etiqueta <a>
  if (content.includes('href={registroUrl}')) {
    content = content
      .replace(/<a href={registroUrl}[^>]*>/g, '')
      .replace(/<\/a>/g, '')
    console.log('WARN: se eliminó el wrapper <a> — revisá el archivo manualmente para agregar InscribirseButton')
  } else {
    console.log('INFO: patrón no encontrado — nada que reemplazar automáticamente')
  }
}

fs.writeFileSync(file, content)
console.log('OK: archivo guardado')
JSEOF

    ok "$DETALLE_PAGE actualizado"
  else
    warn "No se encontró 'href={registroUrl}' en $DETALLE_PAGE"
    warn "Reemplazá manualmente el botón de inscripción:"
    echo ""
    echo "  ANTES:"
    echo "  <a href={registroUrl} target=\"_blank\" rel=\"noopener noreferrer\">"
    echo "    <Button ...>Inscribirme</Button>"
    echo "  </a>"
    echo ""
    echo "  DESPUÉS:"
    echo "  <InscribirseButton"
    echo "    slug={registroModule?.slug ?? ''}"
    echo "    className=\"gap-2 rounded-xl text-xs px-3 py-2 border border-[#26a7fc]/30 text-[#26a7fc] hover:bg-[#26a7fc]/5 font-semibold\""
    echo "  >"
    echo "    Inscribirme"
    echo "  </InscribirseButton>"
    echo ""
    echo "  Y arriba agregá el import:"
    echo "  import { InscribirseButton } from '@/components/cursos/inscribirse-button'"
  fi
fi

# ── 4. Verificar .env.local ───────────────────────────────────────────────────
log "Verificando NEXT_PUBLIC_REGISTRO_URL..."
if [[ -f ".env.local" ]] && grep -q "NEXT_PUBLIC_REGISTRO_URL" .env.local; then
  CURRENT=$(grep "NEXT_PUBLIC_REGISTRO_URL" .env.local)
  ok ".env.local tiene: $CURRENT"
  # Corregir si tiene la URL sin .cc.
  if grep -q "registro.nodo.gob.ar" .env.local; then
    sed -i 's|https://registro.nodo.gob.ar|https://registro.nodo.cc.gob.ar|g' .env.local
    warn "URL corregida a registro.nodo.cc.gob.ar"
  fi
else
  echo "" >> .env.local 2>/dev/null || touch .env.local
  echo "NEXT_PUBLIC_REGISTRO_URL=https://registro.nodo.cc.gob.ar" >> .env.local
  ok "NEXT_PUBLIC_REGISTRO_URL=https://registro.nodo.cc.gob.ar agregado a .env.local"
fi

sep
echo -e "${GREEN}✅  ciudadano-front listo${NC}"
echo ""
echo -e "  ${YELLOW}Reiniciá el servidor:${NC} pnpm dev"
echo ""
echo -e "  ${YELLOW}Flujo SSO completo:${NC}"
echo -e "  1. Usuario logueado en ciudadano-front"
echo -e "  2. Click en 'Inscribirme' → InscribirseButton obtiene idToken"
echo -e "  3. Redirige a: https://registro.nodo.cc.gob.ar/preinscripciones/[slug]?ctoken=TOKEN"
echo -e "  4. registro-front valida el token → pre-rellena el formulario"
echo ""
echo -e "  ${YELLOW}Secret en GitHub (ciudadano-front):${NC}"
echo -e "  NEXT_PUBLIC_REGISTRO_URL = https://registro.nodo.cc.gob.ar"
sep