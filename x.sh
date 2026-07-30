#!/usr/bin/env bash
# =============================================================================
# sso-ciudadano-front-fix2.sh
# ciudadano-front — Reemplazar el botón estático en app/cursos/[id]/page.tsx
#
# La página es un Server Component, por eso no puede usar useAuth.
# Solución: extraer solo el botón a un Client Component pequeño.
#
# QUÉ HACE:
#   1. Crea components/cursos/inscribirse-btn.tsx  — Client Component con useAuth
#   2. Actualiza app/cursos/[id]/page.tsx          — usa InscribirseBtn en lugar del <a>
#   3. Actualiza lib/cursos/registro-url.ts        — agrega la URL base sin token
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
echo -e "${GREEN}ciudadano-front — Fix botón inscripción con SSO${NC}"
sep

# ── 1. components/cursos/inscribirse-btn.tsx ──────────────────────────────────
log "Creando components/cursos/inscribirse-btn.tsx..."
mkdir -p components/cursos

cat > components/cursos/inscribirse-btn.tsx << 'TSX_END'
"use client"

/**
 * InscribirseBtn — Client Component
 *
 * Reemplaza el <a href={buildInscripcionUrl}> estático en el Server Component.
 * Obtiene el idToken de Firebase (si el usuario está logueado en ciudadano-front)
 * y redirige a registro-front con ?ctoken=TOKEN para SSO silencioso.
 *
 * Si el usuario NO está logueado redirige igual sin token — registro pide login.
 */

import { useState, useCallback } from "react"
import { ExternalLink, Loader2 }  from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

const REGISTRO_BASE =
  (process.env.NEXT_PUBLIC_REGISTRO_URL ?? "").replace(/\/$/, "")

interface Props {
  /** slug del módulo de preinscripción — ej: "preinscripcion-robot-basic" */
  slug: string
}

export function InscribirseBtn({ slug }: Props) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    const base = `${REGISTRO_BASE}/preinscripciones/${slug}`
    setLoading(true)
    try {
      if (user) {
        // getIdToken(true) fuerza refresh para evitar token expirado
        const token = await user.getIdToken(true)
        window.location.href = `${base}?ctoken=${encodeURIComponent(token)}`
      } else {
        // Sin sesión → flujo normal, registro pedirá login con Google
        window.location.href = base
      }
    } catch {
      window.location.href = base
    } finally {
      setLoading(false)
    }
  }, [slug, user])

  return (
    <Button
      size="lg"
      onClick={handleClick}
      disabled={loading}
      className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
    >
      {loading
        ? <Loader2 className="h-4 w-4 animate-spin" />
        : <ExternalLink className="h-4 w-4" />
      }
      {loading ? "Redirigiendo..." : "Inscribirme al curso"}
    </Button>
  )
}
TSX_END

ok "components/cursos/inscribirse-btn.tsx creado"

# ── 2. Actualizar app/cursos/[id]/page.tsx ────────────────────────────────────
PAGE="app/cursos/[id]/page.tsx"

if [[ ! -f "$PAGE" ]]; then
  warn "No se encontró $PAGE"
  exit 1
fi

log "Actualizando $PAGE..."
cp "$PAGE" "${PAGE}.bak.$(date +%Y%m%d_%H%M%S)"

# Usar node para el reemplazo exacto
node - << 'JSEOF'
const fs = require('fs')
const file = "app/cursos/[id]/page.tsx"
let content = fs.readFileSync(file, 'utf8')

// ── A. Agregar import de InscribirseBtn ──────────────────────────────────────
if (!content.includes('InscribirseBtn')) {
  // Insertar después del último import existente
  const lines = content.split('\n')
  let lastImportLine = 0
  lines.forEach((line, i) => {
    if (line.startsWith('import ')) lastImportLine = i
  })
  lines.splice(lastImportLine + 1, 0, "import { InscribirseBtn } from '@/components/cursos/inscribirse-btn'")
  content = lines.join('\n')
  console.log('OK: import InscribirseBtn agregado')
}

// ── B. Reemplazar el bloque del botón estático ───────────────────────────────
// Busca el patrón exacto del <Button asChild> con el <a href={buildInscripcionUrl}>
// y lo reemplaza por <InscribirseBtn slug={...}>

// Patrón 1: con puedeInscribirse y buildInscripcionUrl
const patron1 = /\{puedeInscribirse \? \(\s*<Button asChild[\s\S]*?<a href=\{buildInscripcionUrl\(curso\.slug\)\}[\s\S]*?<\/a>\s*<\/Button>\s*\) : \(\s*<Button[\s\S]*?Sin inscripción activa[\s\S]*?<\/Button>\s*\)\}/

if (patron1.test(content)) {
  content = content.replace(patron1,
    `{puedeInscribirse ? (
                    <InscribirseBtn slug={curso.slug} />
                  ) : (
                    <Button size="lg" variant="outline" disabled className="w-full cursor-not-allowed opacity-60">Sin inscripción activa</Button>
                  )}`
  )
  console.log('OK: botón reemplazado con InscribirseBtn (patrón 1)')
} else {
  // Patrón 2: solo el <a href={buildInscripcionUrl}> dentro de Button asChild
  const patron2 = /<Button asChild size="lg"[^>]*>\s*<a href=\{buildInscripcionUrl\(curso\.slug\)\}[^>]*>[\s\S]*?<\/a>\s*<\/Button>/
  if (patron2.test(content)) {
    content = content.replace(patron2, '<InscribirseBtn slug={curso.slug} />')
    console.log('OK: botón reemplazado con InscribirseBtn (patrón 2)')
  } else {
    console.log('WARN: no se encontró el patrón del botón — revisar manualmente')
    console.log('Buscar: href={buildInscripcionUrl(curso.slug)}')
  }
}

// ── C. Quitar import de buildInscripcionUrl si ya no se usa ─────────────────
if (!content.includes('buildInscripcionUrl(') && content.includes("buildInscripcionUrl")) {
  content = content.replace(/import \{ buildInscripcionUrl \} from '[^']+'\n/, '')
  console.log('OK: import buildInscripcionUrl removido')
}

fs.writeFileSync(file, content)
console.log('OK: archivo guardado')
JSEOF

ok "$PAGE actualizado"

# ── 3. Verificar/crear lib/cursos/registro-url.ts ─────────────────────────────
log "Verificando lib/cursos/registro-url.ts..."
if [[ -f "lib/cursos/registro-url.ts" ]]; then
  # Ver qué hace buildInscripcionUrl actualmente
  echo "Contenido actual:"
  cat lib/cursos/registro-url.ts
  echo ""

  # Si no tiene REGISTRO_URL agregar soporte para ctoken
  if ! grep -q "NEXT_PUBLIC_REGISTRO_URL" lib/cursos/registro-url.ts; then
    warn "lib/cursos/registro-url.ts no usa NEXT_PUBLIC_REGISTRO_URL"
    warn "El nuevo InscribirseBtn usa NEXT_PUBLIC_REGISTRO_URL directamente — no hay problema"
  fi
else
  log "Creando lib/cursos/registro-url.ts..."
  mkdir -p lib/cursos
  cat > lib/cursos/registro-url.ts << 'TS_END'
/**
 * lib/cursos/registro-url.ts
 * URL estática a registro-front (sin token).
 * Para SSO usar InscribirseBtn que agrega ?ctoken automáticamente.
 */
const REGISTRO_BASE =
  (process.env.NEXT_PUBLIC_REGISTRO_URL ?? "https://registro.nodo.cc.gob.ar").replace(/\/$/, "")

export function buildInscripcionUrl(slug: string): string {
  return `${REGISTRO_BASE}/preinscripciones/${slug}`
}
TS_END
  ok "lib/cursos/registro-url.ts creado"
fi

# ── 4. Verificar .env.local ───────────────────────────────────────────────────
log "Verificando NEXT_PUBLIC_REGISTRO_URL en .env.local..."
if [[ -f ".env.local" ]] && grep -q "NEXT_PUBLIC_REGISTRO_URL" .env.local; then
  ok "$(grep 'NEXT_PUBLIC_REGISTRO_URL' .env.local)"
else
  echo "NEXT_PUBLIC_REGISTRO_URL=https://registro.nodo.cc.gob.ar" >> .env.local
  ok "NEXT_PUBLIC_REGISTRO_URL=https://registro.nodo.cc.gob.ar agregado"
fi

sep
echo -e "${GREEN}✅  Listo${NC}"
echo ""
echo -e "  ${YELLOW}Reiniciá el servidor:${NC} pnpm dev"
echo ""
echo -e "  ${YELLOW}Verificá en browser:${NC}"
echo -e "  1. Logueate en ciudadano-front"
echo -e "  2. Andá a un curso → 'Inscribirme al curso'"
echo -e "  3. La URL de destino debe tener ?ctoken=eyJ..."
echo -e "  4. registro-front debe mostrar tu nombre/foto directamente"
echo ""
echo -e "  ${YELLOW}Secret en GitHub (ciudadano-front):${NC}"
echo -e "  NEXT_PUBLIC_REGISTRO_URL = https://registro.nodo.cc.gob.ar"
sep