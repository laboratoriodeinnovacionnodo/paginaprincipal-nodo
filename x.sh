#!/usr/bin/env bash
# ciudadano-front — v: chatbot-siri-add-frame-v1
# Agrega un anillo fino y nítido pegado al borde de la pantalla, ENCIMA
# del glow que ya pierde color hacia el centro (no se toca nada de lo
# existente). Es la combinación: glow suave + línea de marco definida,
# tal como se ve en la referencia.

set -euo pipefail

VERSION="chatbot-siri-add-frame-v1"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
COMP_FILE="components/chatbot/siri-frame.tsx"

echo "============================================================"
echo "  ciudadano-front — Agregar Marco  [${VERSION}]"
echo "  $(date)"
echo "============================================================"
echo ""

if [ ! -f "package.json" ] || ! grep -q '"next"' package.json 2>/dev/null; then
  echo "❌ Ejecutá desde la raíz del proyecto ciudadano-front"
  exit 1
fi

if [ ! -f "$COMP_FILE" ]; then
  echo "❌ No se encontró $COMP_FILE"
  exit 1
fi

echo "🔧 Agregando el anillo de marco en ${COMP_FILE}..."
cp "$COMP_FILE" "${COMP_FILE}.bak.${TIMESTAMP}"

node - "$COMP_FILE" <<'NODE_EOF'
const fs = require('fs')
const file = process.argv[2]
let content = fs.readFileSync(file, 'utf8')

if (content.includes('Marco — línea fina pegada al borde')) {
  console.log('  = El marco ya estaba agregado, no se duplica.')
  process.exit(0)
}

const ANCHOR = `      <style jsx>{`
        .siri-frame-spin {`

if (!content.includes(ANCHOR)) {
  console.error('❌ No se encontró el punto de inserción esperado — revisar manualmente.')
  process.exit(1)
}

const FRAME_RING = `      {/* Marco — línea fina pegada al borde de la pantalla, ENCIMA del
          glow que pierde color hacia el centro (no reemplaza nada, se suma) */}
      <div
        className="absolute inset-0 transition-[padding] duration-500 ease-out"
        style={{
          padding: active ? "2.5px" : "1.5px",
          WebkitMaskImage: "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)",
          WebkitMaskClip: "content-box, border-box",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      >
        <div
          className="siri-frame-spin absolute -inset-1/2 h-[200%] w-[200%]"
          style={{
            background: BRAND_GRADIENT,
            filter: \`blur(\${active ? 10 : 6}px)\`,
            opacity: active ? 1 : 0.85,
            animationDuration: active ? "6s" : "16s",
          }}
        />
      </div>

${ANCHOR}`

content = content.replace(ANCHOR, FRAME_RING)
fs.writeFileSync(file, content)
console.log('  ✅ ' + file + ' actualizado')
NODE_EOF

echo ""
echo "🔍 Instalando dependencias..."
if [ -f "pnpm-lock.yaml" ]; then
  pnpm install --frozen-lockfile=false
else
  pnpm install
fi

echo ""
echo "============================================================"
echo "  ✅ ${VERSION} — listo"
echo "============================================================"
echo ""
echo "  Se agregó un anillo fino (1.5px idle / 2.5px activo, blur suave)"
echo "  pegado al borde de TODA la pantalla, usando la misma"
echo "  BRAND_GRADIENT (tokens de marca) — el glow que pierde color"
echo "  hacia el centro sigue exactamente igual, esto se suma encima."
echo ""
echo "  Ajustable si querés más/menos marco:"
echo "    padding (2.5px/1.5px) → grosor del anillo"
echo "    blur (10px/6px)       → qué tan nítido o difuso se ve"
echo ""
echo "  Backup: ${COMP_FILE}.bak.${TIMESTAMP}"
echo ""
echo "  Para revertir:"
echo "    cp ${COMP_FILE}.bak.${TIMESTAMP} ${COMP_FILE}"
echo ""
echo "  pnpm dev    — verificar"
echo "  pnpm build  — build"
echo "============================================================"