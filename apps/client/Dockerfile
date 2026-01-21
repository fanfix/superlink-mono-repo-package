# ===============================
# Client App Dockerfile
# Optimized for independent builds
# ===============================

# -------------------------------
# Base image with Node + Corepack
# -------------------------------
FROM node:20-bullseye-slim AS base

# Set working directory
WORKDIR /app

# Install required system packages
RUN apt-get update && apt-get install -y \
    bash \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Enable Corepack with retry logic (fixes network timeout issues)
RUN corepack enable || true
RUN for i in 1 2 3 4 5; do \
    corepack prepare yarn@stable --activate && break || \
    (echo "Attempt $i failed, retrying..." && sleep $((i * 2))); \
    done

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# -------------------------------
# Dependencies stage
# -------------------------------
FROM base AS deps

# Copy root package files
COPY package.json yarn.lock* .yarnrc.yml ./

# Copy workspace package.json files (needed for workspaces)
COPY apps/admin/package.json ./apps/admin/
COPY apps/agency/package.json ./apps/agency/
COPY apps/client/package.json ./apps/client/
COPY packages/design-system/package.json ./packages/design-system/

# Install dependencies using Yarn v4 (immutable for reproducible builds)
RUN yarn install --immutable

# -------------------------------
# Builder stage
# -------------------------------
FROM base AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy full project
COPY . .

# Build design-system first (dependency)
RUN yarn workspace @superline/design-system build

# Build client app
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn workspace @superline/client build

# -------------------------------
# Production image
# -------------------------------
FROM base AS runner

WORKDIR /app

# Create non-root user
RUN groupadd --gid 1001 nodejs \
 && useradd --uid 1001 --gid 1001 --shell /bin/bash nextjs

# Copy built files from builder
COPY --from=builder /app/apps/client/public ./apps/client/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static

# Prepare .next folder for prerender cache
RUN mkdir .next \
 && chown nextjs:nodejs .next

USER nextjs

# Cloud Run provides PORT env var (defaults to 8080)
# Next.js standalone server automatically uses process.env.PORT
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
EXPOSE 8080

# Start the client service
CMD ["node", "apps/client/server.js"]
