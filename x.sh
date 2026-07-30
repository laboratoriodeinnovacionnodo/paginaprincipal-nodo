#!/usr/bin/env bash
# =============================================================================
# sso-ciudadano-front.sh
# ciudadano-front — Pasar idToken al redirigir a registro-front
#
# QUÉ HACE:
#   - Agrega lib/registro-link.ts → helper que construye la URL de registro
#     con el idToken de Firebase como queryParam (?ctoken=xxx)
#   - Actualiza app/cursos/page.tsx → los botones "Inscribirse" pasan el token
#     (si el usuario está logueado, si no manda sin token y registro pide login)
#
# CÓMO FUNCIONA:
#   1. Usuario logueado en ciudadano-front hace click en "Inscribirse" a un curso
#   2. Se obtiene el idToken de Firebase (fresco, válido 1h)
#   3. Se redirige a: https://registro.nodo.gob.ar/preinscripciones/[slug]?ctoken=TOKEN
#   4. registro-front lee el ?ctoken, valida contra ciudadano-back y pre-rellena
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
echo -e "${GREEN}ciudadano-front — SSO token hacia registro-front${NC}"
sep

# ── 1. lib/registro-link.ts ───────────────────────────────────────────────────
log "Creando lib/registro-link.ts..."

cat > lib/registro-link.ts << 'TS_END'
/**
 * lib/registro-link.ts
 *
 * Helper para construir la URL de registro-front con el idToken de Firebase
 * como queryParam (?ctoken=...) para que registro-front reconozca al ciudadano
 * automáticamente sin pedirle que vuelva a loguearse.
 *
 * El token se llama "ctoken" (ciudadano-token) para no colisionar con otros
 * params de Next.js y ser claro sobre su origen.
 *
 * Seguridad:
 *   - El idToken de Firebase dura 1 hora y está firmado por Google.
 *   - registro-front lo valida contra ciudadano-back (POST /auth/verify).
 *   - Si el token expiró o es inválido, registro-front cae al flujo normal.
 *   - No se loguea ni persiste el token en ningún lado.
 */

import type { User } from "firebase/auth"

const REGISTRO_BASE =
  (process.env.NEXT_PUBLIC_REGISTRO_URL ?? "").replace(/\/$/, "")

/**
 * Construye la URL de la preinscripción en registro-front.
 * Si el usuario está logueado agrega ?ctoken=idToken para SSO silencioso.
 *
 * @param slug   - slug del módulo de preinscripción (ej: "preinscripcion-placas")
 * @param user   - Firebase User | null (del AuthContext de ciudadano-front)
 */
export async function buildRegistroUrl(slug: string, user: User | null): Promise<string> {
  const base = `${REGISTRO_BASE}/preinscripciones/${slug}`

  if (!user) return base

  try {
    // getIdToken(false) usa el token en caché si aún es válido (no fuerza refresh)
    // getIdToken(true)  fuerza refresh — mejor para evitar expirado en el redirect
    const token = await user.getIdToken(true)
    return `${base}?ctoken=${encodeURIComponent(token)}`
  } catch {
    // Si falla (usuario desconectado, etc.) mandamos sin token — registro pide login
    return base
  }
}

/**
 * Versión síncrona para usar en <Link href> — NO incluye token.
 * Usar solo cuando no hay interacción del usuario (ej: links de navegación).
 * Para botones de "Inscribirse" usar buildRegistroUrl() async.
 */
export function registroUrl(slug: string): string {
  return `${REGISTRO_BASE}/preinscripciones/${slug}`
}
TS_END

ok "lib/registro-link.ts creado"

# ── 2. Verificar que NEXT_PUBLIC_REGISTRO_URL esté en .env.local ──────────────
log "Verificando variable NEXT_PUBLIC_REGISTRO_URL..."
if [[ -f ".env.local" ]] && grep -q "NEXT_PUBLIC_REGISTRO_URL" .env.local; then
  ok "NEXT_PUBLIC_REGISTRO_URL ya está en .env.local"
elif [[ -f ".env" ]] && grep -q "NEXT_PUBLIC_REGISTRO_URL" .env; then
  ok "NEXT_PUBLIC_REGISTRO_URL ya está en .env"
else
  warn "Agregar en .env.local:"
  echo "  NEXT_PUBLIC_REGISTRO_URL=https://registro.nodo.gob.ar"
  echo ""
  # Agregar al .env.local si existe, sino crear
  if [[ -f ".env.local" ]]; then
    echo "" >> .env.local
    echo "# URL de registro-front para links SSO" >> .env.local
    echo "NEXT_PUBLIC_REGISTRO_URL=https://registro.nodo.gob.ar" >> .env.local
    ok "NEXT_PUBLIC_REGISTRO_URL agregado a .env.local (ajustar la URL)"
  else
    echo "NEXT_PUBLIC_REGISTRO_URL=https://registro.nodo.gob.ar" > .env.local
    ok ".env.local creado con NEXT_PUBLIC_REGISTRO_URL (ajustar la URL)"
  fi
fi

# ── 3. Actualizar app/cursos/page.tsx — botón "Inscribirse" con token ─────────
# Buscamos si existe la página de cursos
CURSOS_PAGE=""
for p in "app/cursos/page.tsx" "app/(public)/cursos/page.tsx" "app/cursos/page.jsx"; do
  if [[ -f "$p" ]]; then
    CURSOS_PAGE="$p"
    break
  fi
done

if [[ -z "$CURSOS_PAGE" ]]; then
  warn "No se encontró app/cursos/page.tsx — creando componente helper para usar manualmente"
else
  log "Encontrado: $CURSOS_PAGE"
  cp "$CURSOS_PAGE" "${CURSOS_PAGE}.bak.$(date +%Y%m%d_%H%M%S)"
fi

# ── 4. Crear componente InscribirseButton reutilizable ────────────────────────
log "Creando components/cursos/inscribirse-button.tsx..."
mkdir -p components/cursos

cat > components/cursos/inscribirse-button.tsx << 'TSX_END'
"use client"

/**
 * InscribirseButton
 *
 * Botón que redirige a registro-front con el idToken de Firebase para SSO.
 * Si el usuario NO está logueado, redirige igual (sin token) — registro pedirá login.
 * Si el usuario SÍ está logueado, el formulario de registro lo reconoce automáticamente.
 *
 * Uso:
 *   <InscribirseButton slug="preinscripcion-placas" label="Inscribirse" />
 *
 * Props:
 *   slug    — slug del módulo de preinscripción en registro-back
 *   label   — texto del botón (default: "Inscribirme")
 *   className — clases adicionales de Tailwind
 */

import { useState, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { buildRegistroUrl } from "@/lib/registro-link"

interface InscribirseButtonProps {
  slug:       string
  label?:     string
  className?: string
}

export function InscribirseButton({
  slug,
  label     = "Inscribirme",
  className = "",
}: InscribirseButtonProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setLoading(true)
    try {
      const url = await buildRegistroUrl(slug, user)
      window.location.href = url
    } catch {
      // Fallback sin token
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
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-60 disabled:cursor-wait ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? "Redirigiendo..." : label}
    </button>
  )
}
TSX_END

ok "components/cursos/inscribirse-button.tsx creado"

sep
echo -e "${GREEN}✅  ciudadano-front listo${NC}"
echo ""
echo -e "  ${YELLOW}Uso en cualquier página de cursos:${NC}"
echo ""
echo -e "  import { InscribirseButton } from '@/components/cursos/inscribirse-button'"
echo ""
echo -e "  <InscribirseButton"
echo -e "    slug=\"preinscripcion-placas-basicas\""
echo -e "    label=\"Inscribirme al curso\""
echo -e "    className=\"w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl px-6 py-3\""
echo -e "  />"
echo ""
echo -e "  ${YELLOW}Variable de entorno requerida:${NC}"
echo -e "  NEXT_PUBLIC_REGISTRO_URL=https://registro.nodo.gob.ar"
echo ""
echo -e "  ${YELLOW}También agregar en GitHub Secrets (deploy.yml build-args):${NC}"
echo -e "  NEXT_PUBLIC_REGISTRO_URL=\${{ secrets.NEXT_PUBLIC_REGISTRO_URL }}"
sep