# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Disable lifecycle scripts to avoid running postinstall (prisma generate) before code is copied
RUN npm install -g pnpm@10.7.1 && pnpm install --frozen-lockfile --ignore-scripts

# Build the app
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@10.7.1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm exec prisma generate && pnpm build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm@10.7.1
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["pnpm", "start"] 