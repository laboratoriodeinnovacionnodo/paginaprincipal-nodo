#!/usr/bin/env bash
# =============================================================================
# 07_ciudadano-front_fix-landing-runtime.sh
#
# DIAGNÓSTICO:
#   1. NOTICIAS_API_URL está en build secrets pero NO en el docker run runtime
#      → el contenedor arranca sin esa variable → getLandingConfig usa FALLBACK
#   2. `next: { revalidate: 60 }` en ISR standalone no persiste entre reinicios
#      del contenedor → siempre sirve el FALLBACK hardcodeado
#
# SOLUCIÓN (solo código — el deploy.yml lo editás manualmente):
#   - lib/landing.ts: revalidate: 0 (always fresh) + logs de diagnóstico
#   - Dockerfile: agrega NOTICIAS_API_URL como ARG/ENV en el runner stage
#
# CAMBIO MANUAL REQUERIDO en .github/workflows/deploy.yml (ver abajo)
# =============================================================================
set -euo pipefail

echo "🔧 [ciudadano-front] Fix runtime NOTICIAS_API_URL..."

# ─── 1. lib/landing.ts — siempre fresco, sin ISR roto ────────────────────────
echo ""
echo "📌 Actualizando lib/landing.ts..."

cat > lib/landing.ts << 'ENDOFFILE'
/**
 * lib/landing.ts
 * Server Component — fetch siempre fresco (no ISR).
 *
 * NOTICIAS_API_URL es una variable de entorno de SERVIDOR (sin NEXT_PUBLIC_),
 * disponible solo en runtime dentro del contenedor Docker (red_interna).
 * Valor esperado: http://noticias-back:3000
 */

const API_URL = (
  process.env.NOTICIAS_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ''
).replace(/\/$/, '')

export interface LandingConfig {
  titulo:      string
  descripcion: string
  videoUrl:    string
}

const FALLBACK: LandingConfig = {
  titulo:      'Conecta, Innova y Crea el Futuro',
  descripcion: 'El Nodo Tecnológico de Catamarca conecta innovación y Tecnología, impulsando a los jóvenes hacia las habilidades del futuro a través de cursos especializados.',
  videoUrl:    'https://www.pexels.com/download/video/14994578/',
}

export async function getLandingConfig(): Promise<LandingConfig> {
  if (!API_URL) {
    console.warn('[landing] NOTICIAS_API_URL no definida — usando fallback')
    return FALLBACK
  }

  try {
    const url = `${API_URL}/api/v1/landing`
    const res = await fetch(url, {
      cache: 'no-store', // siempre fresco, sin ISR que se rompe en standalone
    })

    if (!res.ok) {
      console.error(`[landing] GET ${url} → ${res.status}`)
      return FALLBACK
    }

    const json = await res.json() as { data?: LandingConfig } & LandingConfig
    const data = (json.data ?? json) as LandingConfig

    return {
      titulo:      data.titulo      || FALLBACK.titulo,
      descripcion: data.descripcion || FALLBACK.descripcion,
      videoUrl:    data.videoUrl    || FALLBACK.videoUrl,
    }
  } catch (err) {
    console.error('[landing] Error al obtener config:', err)
    return FALLBACK
  }
}
ENDOFFILE

echo "✅ lib/landing.ts actualizado (cache: no-store)"

# ─── 2. Dockerfile — pasar NOTICIAS_API_URL al runner stage ──────────────────
echo ""
echo "📌 Actualizando Dockerfile para incluir NOTICIAS_API_URL en runtime..."

DOCKERFILE="Dockerfile"
cp "$DOCKERFILE" "${DOCKERFILE}.bak"

# Verificar si ya tiene NOTICIAS_API_URL
if grep -q "NOTICIAS_API_URL" "$DOCKERFILE"; then
  echo "ℹ️  Dockerfile ya tiene NOTICIAS_API_URL — verificando posición..."
else
  # Agregar ARG + ENV en el runner stage, después de ENV HOSTNAME=0.0.0.0
  sed -i 's/ENV HOSTNAME=0.0.0.0/ENV HOSTNAME=0.0.0.0\n\n# Variable de servidor para conectar con noticias-back en red_interna\nARG  NOTICIAS_API_URL\nENV  NOTICIAS_API_URL=$NOTICIAS_API_URL/' "$DOCKERFILE"
  echo "✅ NOTICIAS_API_URL agregado al runner stage del Dockerfile"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "⚠️  CAMBIOS MANUALES REQUERIDOS en .github/workflows/deploy.yml"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  En el step 'Build y push imagen', agregar a build-args:"
echo ""
echo "          build-args: |"
echo "            NEXT_PUBLIC_API_URL=\${{ secrets.NEXT_PUBLIC_API_URL }}"
echo "            NOTICIAS_API_URL=\${{ secrets.NOTICIAS_API_URL }}"
echo ""
echo "2️⃣  En el step 'Deploy en servidor', agregar a envs:"
echo ""
echo "          envs: NEXT_GROQ_API_KEY,NEXT_GROQ_MODEL,NOTICIAS_API_URL"
echo ""
echo "3️⃣  En el script SSH, agregar al printf del .env:"
echo ""
echo '          printf '"'"'%s\n'"'"' \'
echo '            "NEXT_GROQ_API_KEY=${NEXT_GROQ_API_KEY}" \'
echo '            "NEXT_GROQ_MODEL=${NEXT_GROQ_MODEL}" \'
echo '            "NOTICIAS_API_URL=${NOTICIAS_API_URL}" \'
echo '            > /etc/ciudadano-front/.env'
echo ""
echo "════════════════════════════════════════════════════════════════"

# ─── 3. Build de verificación ─────────────────────────────────────────────────
echo ""
echo "🔨 Verificando build..."
pnpm build

echo ""
echo "✅ [ciudadano-front] Fix aplicado."
echo ""
echo "📋 Archivos modificados:"
echo "   lib/landing.ts   ← cache: no-store (siempre fresco)"
echo "   Dockerfile       ← NOTICIAS_API_URL en runner stage"
echo ""
echo "📌 Después de editar el deploy.yml y hacer push,"
echo "   ciudadano-front leerá la config de noticias-back en cada request."