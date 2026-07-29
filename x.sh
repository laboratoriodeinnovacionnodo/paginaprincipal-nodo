#!/usr/bin/env bash
# =============================================================================
# fix-remove-modules.sh — ciudadano-front
# Elimina los módulos: Graduados, Inscripción (páginas + nav + footer + sitemap)
# Saca del nav el link a la página "/chatia-nodo" (no existe como page).
# NO TOCA el widget flotante de chat (components/chatbot/chatbot-widget.tsx,
# app/api/chat/route.ts, ni su botón "Consultarle a la IA").
# Ejecutar desde la raíz del repo ciudadano-front: bash fix-remove-modules.sh
# =============================================================================
set -euo pipefail

echo "🧹 Eliminando carpetas de los módulos..."

rm -rf app/graduados
rm -rf app/inscripcion
rm -rf hooks/inscripcion
rm -rf lib/inscripcion
rm -rf hooks/graduados
rm -rf lib/graduados

echo "✅ Carpetas eliminadas."

# -----------------------------------------------------------------------------
# lib/header.ts — sacar los items del nav (Graduados / Inscripción / ChatIA-page)
# -----------------------------------------------------------------------------
echo "🧹 Limpiando lib/header.ts..."

perl -0777 -pi -e 's/\s*\{\s*label:\s*"Graduados",\s*href:\s*"\/graduados",\s*\},//s' lib/header.ts
perl -0777 -pi -e 's/\s*\{\s*label:\s*"Inscripción",\s*href:\s*"\/inscripcion",\s*\},//s' lib/header.ts
perl -0777 -pi -e 's/\s*\{\s*label:\s*"ChatIA",\s*href:\s*"\/chatia-nodo",\s*\},//s' lib/header.ts

# -----------------------------------------------------------------------------
# components/header.tsx — sacar iconos del mapa navIcons (desktop + drawer mobile)
# -----------------------------------------------------------------------------
echo "🧹 Limpiando components/header.tsx..."

sed -i \
  -e '/"\/graduados":[[:space:]]*Award,/d' \
  -e '/"\/inscripcion":[[:space:]]*Calendar,/d' \
  -e '/"\/chatia-nodo":[[:space:]]*Bot,/d' \
  components/header.tsx

# -----------------------------------------------------------------------------
# components/footer.tsx — sacar el link a la página /chatia-nodo (no el widget)
# -----------------------------------------------------------------------------
echo "🧹 Limpiando components/footer.tsx..."

perl -0777 -pi -e 's/\s*<li>\s*<Link href="\/chatia-nodo"[^<]*>\s*ChatIA\s*<\/Link>\s*<\/li>//s' components/footer.tsx

# -----------------------------------------------------------------------------
# app/sitemap.ts — sacar entrada de /chatia-nodo
# -----------------------------------------------------------------------------
echo "🧹 Limpiando app/sitemap.ts..."

perl -0777 -pi -e 's/\s*\{\s*url:\s*`\$\{baseUrl\}\/chatia-nodo`,\s*lastModified:\s*new Date\(\),\s*changeFrequency:\s*"monthly",\s*priority:\s*0\.6,\s*\},//s' app/sitemap.ts

echo ""
echo "✅ Listo. Módulos Graduados / Inscripción eliminados y nav limpio."
echo "✅ El botón flotante de chat con IA (ChatbotWidget) NO fue tocado."
echo ""
echo "⚠️  Revisar manualmente (no tocado por el script):"
echo "   - Verificar que no queden imports sin usar (Award, Calendar) en components/header.tsx"
echo "   - app/layout.tsx sigue importando y renderizando <ChatbotWidget /> normalmente"
echo ""
echo "▶️  Corré 'pnpm build' antes de deployar para confirmar que compila limpio."