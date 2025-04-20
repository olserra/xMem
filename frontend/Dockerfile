FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Environment variables will be handled by docker-compose
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV=development

# Start development server with hot reloading
CMD ["pnpm", "dev"] 