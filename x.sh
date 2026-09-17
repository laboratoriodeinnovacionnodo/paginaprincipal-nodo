#!/usr/bin/env bash
# ============================================================================
#  v31b-ciudadano-fix-calendario-url.sh  — ciudadano-front
#  Fix: el hook usaba NEXT_PUBLIC_EVENTOS_API_URL que no existe en este repo.
#  La variable correcta es NEXT_PUBLIC_CALENDARIO_API_URL (ya en Dockerfile).
# ============================================================================
set -euo pipefail

GREEN='\033[0;32m'; RESET='\033[0m'
ok()   { echo -e "${GREEN}✅  $*${RESET}"; }
fail() { echo -e "\033[0;31m❌  $*${RESET}"; exit 1; }

[[ -f "package.json" && -d "app" ]] || fail "Corré desde la raíz de ciudadano-front"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  v31b · fix variable calendario en use-evento-activo"
echo "════════════════════════════════════════════════════════════"
echo ""

# ── Corregir la variable en el hook ──────────────────────────────────────
echo "🔧  hooks/coworking/use-evento-activo-coworking.ts"

sed -i 's/process\.env\.NEXT_PUBLIC_EVENTOS_API_URL/process.env.NEXT_PUBLIC_CALENDARIO_API_URL/g' \
  hooks/coworking/use-evento-activo-coworking.ts

ok "Variable corregida: NEXT_PUBLIC_EVENTOS_API_URL → NEXT_PUBLIC_CALENDARIO_API_URL"

# ── Verificar que quedó bien ──────────────────────────────────────────────
grep "NEXT_PUBLIC_CALENDARIO_API_URL" hooks/coworking/use-evento-activo-coworking.ts \
  && ok "Confirmado en el archivo" \
  || { echo "❌ No se encontró la variable — revisá manualmente"; exit 1; }

# ── TypeScript check ──────────────────────────────────────────────────────
echo ""
echo "🔨  TypeScript check..."
pnpm exec tsc --noEmit --skipLibCheck 2>&1 | head -30 || true

echo ""
echo "🔨  Build..."
pnpm build

echo ""
echo -e "\033[0;32m════════════════════════════════════════════════════════════\033[0m"
echo -e "\033[0;32m  ✅  v31b completado\033[0m"
echo -e "\033[0;32m════════════════════════════════════════════════════════════\033[0m"
echo ""
echo "  El hook ahora usa NEXT_PUBLIC_CALENDARIO_API_URL"
echo "  (la misma que usan lib/eventos/api.ts y lib/coworking/eventos-api.ts)"
echo ""