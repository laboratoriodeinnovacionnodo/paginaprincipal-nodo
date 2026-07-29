#!/usr/bin/env bash
# =============================================================================
# fix-remove-modules.sh — ciudadano-front
# Elimina los módulos: Graduados, Inscripción, ChatIA (chatia-nodo)
# y limpia sus referencias en nav (desktop/mobile), footer, sitemap y layout.
# Ejecutar desde la raíz del repo ciudadano-front: bash fix-remove-modules.sh
# =============================================================================
set -euo pipefail

echo "🧹 Eliminando carpetas de los módulos..."

rm -rf app/graduados
rm -rf app/inscripcion
rm -rf app/api/chat
rm -rf components/chatbot
rm -rf hooks/chatia-nodo
rm -rf lib/chatia-nodo
rm -rf hooks/inscripcion
rm -rf lib/inscripcion
rm -rf hooks/graduados
rm -rf lib/graduados

echo "✅ Carpetas eliminadas."

# -----------------------------------------------------------------------------
# lib/header.ts — sacar los 3 items del nav (Graduados / Inscripción / ChatIA)
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
# app/layout.tsx — sacar el widget flotante de ChatIA
# -----------------------------------------------------------------------------
echo "🧹 Limpiando app/layout.tsx..."

sed -i '/import { ChatbotWidget } from "@\/components\/chatbot\/chatbot-widget"/d' app/layout.tsx
sed -i '/<ChatbotWidget \/>/d' app/layout.tsx

# -----------------------------------------------------------------------------
# components/footer.tsx — sacar el link a ChatIA
# -----------------------------------------------------------------------------
echo "🧹 Limpiando components/footer.tsx..."

perl -0777 -pi -e 's/\s*<li>\s*<Link href="\/chatia-nodo"[^<]*>\s*ChatIA\s*<\/Link>\s*<\/li>//s' components/footer.tsx

# -----------------------------------------------------------------------------
# components/home/contacto-section.tsx — sacar botón "Consultarle a la IA"
# -----------------------------------------------------------------------------
echo "🧹 Limpiando components/home/contacto-section.tsx..."

perl -0777 -pi -e 's/\s*const handleOpenChatbot = \(\) => \{\s*const event = new CustomEvent\("open-chatbot"\)\s*window\.dispatchEvent\(event\)\s*\}//s' components/home/contacto-section.tsx

perl -0777 -pi -e 's/\s*<div className="text-center mt-8">\s*<Button size="lg" onClick=\{handleOpenChatbot\}>\s*Consultarle a la IA\s*<\/Button>\s*<\/div>//s' components/home/contacto-section.tsx

# -----------------------------------------------------------------------------
# app/sitemap.ts — sacar entrada de /chatia-nodo
# -----------------------------------------------------------------------------
echo "🧹 Limpiando app/sitemap.ts..."

perl -0777 -pi -e 's/\s*\{\s*url:\s*`\$\{baseUrl\}\/chatia-nodo`,\s*lastModified:\s*new Date\(\),\s*changeFrequency:\s*"monthly",\s*priority:\s*0\.6,\s*\},//s' app/sitemap.ts

echo ""
echo "✅ Listo. Módulos Graduados / Inscripción / ChatIA eliminados y nav limpio."
echo ""
echo "⚠️  Revisar manualmente (no tocado por el script):"
echo "   - package.json: dependencia 'groq-sdk' ya no se usa (opcional: pnpm remove groq-sdk)"
echo "   - .github/workflows/deploy.yml y Dockerfile: si tenías secrets NEXT_GROQ_API_KEY / NEXT_GROQ_MODEL,"
echo "     podés sacarlos si ya no los usa ningún otro módulo"
echo "   - Verificar que no queden imports sin usar (Award, Calendar, Bot) en components/header.tsx si tu linter es estricto"
echo ""
echo "▶️  Corré 'pnpm build' antes de deployar para confirmar que compila limpio."