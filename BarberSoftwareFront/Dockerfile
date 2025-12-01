# ================================
#   ETAPA 1 — BUILD DEL FRONT
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build:ssr

# ================================
#   ETAPA 2 — SERVIDOR NODE SSR
# ================================
FROM node:20-alpine AS runner

WORKDIR /app

# Copiamos solo lo que hace falta
COPY --from=builder /app/dist ./dist

# Railway asigna un puerto dinámico
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/barber-software-front/server/server.mjs"]
