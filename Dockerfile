# ─── Stage 1: deps ───────────────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --no-frozen-lockfile

# ─── Stage 2: build ──────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=NEXT_GROQ_API_KEY \
    --mount=type=secret,id=NEXT_GROQ_MODEL \
    --mount=type=secret,id=NEXT_PUBLIC_FIREBASE_API_KEY \
    --mount=type=secret,id=NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
    --mount=type=secret,id=NEXT_PUBLIC_FIREBASE_PROJECT_ID \
    --mount=type=secret,id=NEXT_PUBLIC_FIREBASE_APP_ID \
    --mount=type=secret,id=NEXT_PUBLIC_CIUDADANO_API_URL \
    NEXT_GROQ_API_KEY=$(cat /run/secrets/NEXT_GROQ_API_KEY) \
    NEXT_GROQ_MODEL=$(cat /run/secrets/NEXT_GROQ_MODEL) \
    NEXT_PUBLIC_FIREBASE_API_KEY=$(cat /run/secrets/NEXT_PUBLIC_FIREBASE_API_KEY) \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$(cat /run/secrets/NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) \
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=$(cat /run/secrets/NEXT_PUBLIC_FIREBASE_PROJECT_ID) \
    NEXT_PUBLIC_FIREBASE_APP_ID=$(cat /run/secrets/NEXT_PUBLIC_FIREBASE_APP_ID) \
    NEXT_PUBLIC_CIUDADANO_API_URL=$(cat /run/secrets/NEXT_PUBLIC_CIUDADANO_API_URL) \
    pnpm run build

# ─── Stage 3: runner ─────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]