#!/usr/bin/env bash
# =============================================================================
# fix-duplicate-import-cursos-id.sh — ciudadano-front
# Corrige: import duplicado de buildInscripcionUrl en app/cursos/[id]/page.tsx
# que rompía el build de Turbopack.
# Ejecutar desde la raíz del repo ciudadano-front: bash fix-duplicate-import-cursos-id.sh
# =============================================================================
set -euo pipefail

FILE="app/cursos/[id]/page.tsx"

if [ ! -f "$FILE" ]; then
  echo "❌ No se encontró $FILE"
  exit 1
fi

echo "🔎 Ocurrencias actuales del import duplicado:"
grep -n "buildInscripcionUrl' " "$FILE" || true
grep -n "from '@/lib/cursos/registro-url'" "$FILE"

echo ""
echo "🧹 Eliminando líneas de import duplicadas, dejando solo una..."

awk '
  /from .\@\/lib\/cursos\/registro-url./ {
    if (seen++) next
  }
  { print }
' "$FILE" > "${FILE}.tmp" && mv "${FILE}.tmp" "$FILE"

echo ""
echo "✅ Imports después del fix:"
grep -n "from '@/lib/cursos/registro-url'" "$FILE"

echo ""
echo "🔎 Verificando que el botón 'Aprender con el Profe IA' esté presente..."
if grep -q "profe.nodo.cc.gob.ar" "$FILE"; then
  echo "   → OK, está presente."
else
  echo "   ⚠️  No se encontró el botón del Profe IA en el detalle. Revisar manualmente."
fi

echo ""
echo "▶️  Corré 'pnpm build' localmente para confirmar antes de pushear."