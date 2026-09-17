#!/usr/bin/env bash
# ============================================================================
#  v33b-ciudadano-chatbot-fixes.sh  — ciudadano-front
#  Fix 1: Dockerfile → NEXT_GROQ_* como ENV en el runner stage
#  Fix 2: chatbot-widget → reemplaza excited.png por botón con ícono Bot
# ============================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; RESET='\033[0m'
ok()   { echo -e "${GREEN}✅  $*${RESET}"; }
warn() { echo -e "${YELLOW}⚠️   $*${RESET}"; }
fail() { echo -e "${RED}❌  $*${RESET}"; exit 1; }

[[ -f "package.json" && -d "app" ]] || fail "Corré desde la raíz de ciudadano-front"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  v33b · fix Groq runtime + botón chatbot sin imagen"
echo "════════════════════════════════════════════════════════════"
echo ""

# ── Fix 1: Dockerfile ─────────────────────────────────────────────────────
# Agregar NEXT_GROQ_* como ENV en el runner stage para que Next.js
# los lea en runtime (igual que NOTICIAS_API_URL ya lo hace)
echo "📄  Dockerfile — agregar ENV NEXT_GROQ_* en runner stage"

node << 'JSEOF'
const fs  = require('fs')
const src = fs.readFileSync('Dockerfile', 'utf8')

const anchor = 'ARG NOTICIAS_API_URL\nENV NOTICIAS_API_URL=$NOTICIAS_API_URL'

if (src.includes('NEXT_GROQ_API_KEY') && src.includes('ARG NEXT_GROQ_API_KEY')) {
  console.log('ℹ️  Dockerfile ya tiene NEXT_GROQ_API_KEY en runner stage')
  process.exit(0)
}

const addition = `ARG NOTICIAS_API_URL
ENV NOTICIAS_API_URL=$NOTICIAS_API_URL
ARG NEXT_GROQ_API_KEY
ENV NEXT_GROQ_API_KEY=$NEXT_GROQ_API_KEY
ARG NEXT_GROQ_MODEL
ENV NEXT_GROQ_MODEL=$NEXT_GROQ_MODEL`

if (!src.includes(anchor)) {
  console.log('⚠️  No se encontró el anchor exacto en Dockerfile — agregá manualmente:')
  console.log('    ARG NEXT_GROQ_API_KEY')
  console.log('    ENV NEXT_GROQ_API_KEY=$NEXT_GROQ_API_KEY')
  console.log('    ARG NEXT_GROQ_MODEL')
  console.log('    ENV NEXT_GROQ_MODEL=$NEXT_GROQ_MODEL')
  console.log('    (después de ARG NOTICIAS_API_URL / ENV NOTICIAS_API_URL)')
  process.exit(0)
}

const updated = src.replace(anchor, addition)
fs.writeFileSync('Dockerfile', updated)
console.log('✅  NEXT_GROQ_API_KEY y NEXT_GROQ_MODEL agregados al runner stage')
JSEOF

# También necesitamos agregarlos como build-args en deploy.yml
echo ""
echo "📄  .github/workflows/deploy.yml — agregar NEXT_GROQ_* a build-args"

node << 'JSEOF'
const fs  = require('fs')
const src = fs.readFileSync('.github/workflows/deploy.yml', 'utf8')

if (src.includes('NEXT_GROQ_API_KEY') && src.match(/build-args[\s\S]*?NEXT_GROQ_API_KEY/)) {
  console.log('ℹ️  deploy.yml ya tiene NEXT_GROQ_API_KEY en build-args')
  process.exit(0)
}

// Anchor en build-args (la última línea de secrets del build step)
const anchor = 'NEXT_PUBLIC_CALENDARIO_API_URL=${{ secrets.NEXT_PUBLIC_CALENDARIO_API_URL }}'
const addition = `NEXT_PUBLIC_CALENDARIO_API_URL=\${{ secrets.NEXT_PUBLIC_CALENDARIO_API_URL }}
            NEXT_GROQ_API_KEY=\${{ secrets.NEXT_GROQ_API_KEY }}
            NEXT_GROQ_MODEL=\${{ secrets.NEXT_GROQ_MODEL }}`

if (!src.includes(anchor)) {
  console.log('⚠️  Anchor no encontrado en deploy.yml')
  console.log('    Agregá manualmente en la sección build-args:')
  console.log('            NEXT_GROQ_API_KEY=${{ secrets.NEXT_GROQ_API_KEY }}')
  console.log('            NEXT_GROQ_MODEL=${{ secrets.NEXT_GROQ_MODEL }}')
  process.exit(0)
}

const updated = src.replace(anchor, addition)
fs.writeFileSync('.github/workflows/deploy.yml', updated)
console.log('✅  NEXT_GROQ_API_KEY y NEXT_GROQ_MODEL agregados a build-args')
JSEOF

ok "Dockerfile y deploy.yml actualizados"

# ── Fix 2: chatbot-widget — botón sin imagen externa ─────────────────────
echo ""
echo "📄  components/chatbot/chatbot-widget.tsx — reemplazar botón excited.png"

# Solo parchear el botón flotante — reemplazar la parte de Image por ícono Bot
node << 'JSEOF'
const fs  = require('fs')
let   src = fs.readFileSync('components/chatbot/chatbot-widget.tsx', 'utf8')

// Verificar si tiene la imagen
if (!src.includes('excited.png') && !src.includes('<Image')) {
  console.log('ℹ️  El widget ya no usa Image para el botón flotante')
  process.exit(0)
}

// Reemplazar el botón flotante completo que usa <Image>
const oldBtn = `      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir asistente virtual"
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 cursor-pointer overflow-hidden bg-transparent border-0 p-0"
      >
        <Image
          src="/excited.png"
          alt="Asistente virtual"
          width={64}
          height={64}
          className="h-full w-full object-contain"
          priority
        />
      </button>`

const newBtn = `      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir asistente virtual"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 cursor-pointer flex items-center justify-center border-0"
        style={{ backgroundImage: "linear-gradient(to bottom right, #26a7fc, #1c8fe0)" }}
      >
        <Bot className="h-6 w-6 text-white" />
      </button>`

if (src.includes(oldBtn)) {
  src = src.replace(oldBtn, newBtn)
  // Quitar import de Image si ya no se usa
  if (!src.includes('<Image') && src.includes("import Image from")) {
    src = src.replace(/^import Image from "next\/image"\n/m, '')
  }
  fs.writeFileSync('components/chatbot/chatbot-widget.tsx', src)
  console.log('✅  Botón flotante actualizado: ícono Bot en lugar de excited.png')
} else {
  console.log('⚠️  No se encontró el bloque exacto del botón — revisá manualmente')
  console.log('    Reemplazá el <Image src="/excited.png"> por:')
  console.log('    <Bot className="h-6 w-6 text-white" />')
}
JSEOF

ok "chatbot-widget.tsx actualizado"

# ── TypeScript check ──────────────────────────────────────────────────────
echo ""
echo "🔨  TypeScript check..."
pnpm exec tsc --noEmit --skipLibCheck 2>&1 | head -30 || true

echo ""
echo "🔨  Build..."
pnpm build

echo ""
echo -e "\033[0;32m════════════════════════════════════════════════════════════\033[0m"
echo -e "\033[0;32m  ✅  v33b completado\033[0m"
echo -e "\033[0;32m════════════════════════════════════════════════════════════\033[0m"
echo ""
echo "  Fix 1 — API 500 (Groq):"
echo "    Dockerfile: NEXT_GROQ_API_KEY y NEXT_GROQ_MODEL como ARG/ENV en runner"
echo "    deploy.yml: agregados a build-args para pasar al runner stage"
echo ""
echo "  Fix 2 — excited.png 404:"
echo "    Botón flotante usa ícono Bot de lucide (sin depender de archivos externos)"
echo ""