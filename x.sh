#!/usr/bin/env bash
# =============================================================================
# ciudadano-front — Fix: agregar <Toaster /> en app/layout.tsx
#
# Sin el <Toaster /> montado, sonner no renderiza nada visualmente.
# El toast() se llama correctamente pero no hay donde mostrarlo.
#
# CORRER PARADO EN LA RAÍZ DE ciudadano-front
# =============================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${BLUE}[fix]${NC} $1"; }
ok()   { echo -e "${GREEN}✔${NC}  $1"; }
sep()  { echo -e "\n${GREEN}────────────────────────────────────────────────${NC}"; }

sep
echo -e "${GREEN}Fix — <Toaster /> faltante en app/layout.tsx${NC}"
sep

[[ -f "package.json" ]] || { echo "Ejecutar desde la raíz de ciudadano-front"; exit 1; }
[[ -f "app/layout.tsx" ]] || { echo "No se encontró app/layout.tsx"; exit 1; }

log "Verificando si Toaster ya está en layout.tsx..."
if grep -q "Toaster" app/layout.tsx; then
  echo -e "${YELLOW}⚠${NC}  Toaster ya está importado. Verificando si está renderizado..."
  if grep -q "<Toaster" app/layout.tsx; then
    echo -e "${GREEN}✔${NC}  <Toaster /> ya está renderizado — nada que hacer"
    exit 0
  fi
fi

log "Haciendo backup de app/layout.tsx..."
cp app/layout.tsx app/layout.tsx.bak.$(date +%Y%m%d_%H%M%S)
ok "Backup creado"

log "Agregando import de Toaster si no existe..."
if ! grep -q "from 'sonner'" app/layout.tsx && ! grep -q 'from "sonner"' app/layout.tsx; then
  # Agregar import después de la última línea de import
  sed -i "/^import.*from/!b;:a;n;/^import/ba;i import { Toaster } from 'sonner'" app/layout.tsx
fi

log "Insertando <Toaster /> dentro del AuthProvider justo antes del cierre..."
# Estrategia: reemplazar </AuthProvider> por <Toaster ... /></AuthProvider>
sed -i 's|</AuthProvider>|  <Toaster position="top-center" richColors toastOptions={{ style: { fontFamily: "var(--font-inter, Inter, sans-serif)" } }} />\n        </AuthProvider>|' app/layout.tsx

ok "app/layout.tsx actualizado"

# Verificar
log "Verificando resultado..."
if grep -q "<Toaster" app/layout.tsx; then
  ok "<Toaster /> encontrado en layout.tsx ✅"
  grep -n "Toaster" app/layout.tsx
else
  echo -e "${YELLOW}⚠${NC}  No se pudo insertar automáticamente. Editá app/layout.tsx manualmente:"
  echo ""
  echo "  Dentro del <body>, antes de </AuthProvider>, agregar:"
  echo '  <Toaster position="top-center" richColors />'
  echo ""
  echo "  O si usás el wrapper de shadcn:"
  echo '  import { Toaster } from "@/components/ui/sonner"'
  echo '  <Toaster position="top-center" richColors />'
fi

sep
echo -e "${GREEN}✅  Fix aplicado${NC}"
echo ""
echo -e "  El ${YELLOW}<Toaster />${NC} ahora está montado en el root layout."
echo -e "  Todos los ${YELLOW}toast()${NC} de sonner van a ser visibles en cualquier página."
echo ""
echo -e "  Colores de marca usados: ${YELLOW}richColors${NC} + position top-center"
sep