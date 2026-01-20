# Root Dockerfile - Builds a single service based on BUILD_SERVICE argument
# Default: admin
# Usage: docker build --build-arg BUILD_SERVICE=admin -t image:tag .
#        docker build --build-arg BUILD_SERVICE=agency -t image:tag .
#        docker build --build-arg BUILD_SERVICE=client -t image:tag .
#
# NOTE: This only builds ONE service at a time.
# To build ALL 3 services, use cloudbuild.yaml instead!

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
ARG BUILD_SERVICE=admin
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable Corepack for Yarn
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

# Copy root package files
COPY package.json yarn.lock* .yarnrc.yml ./
# Note: .yarn directory is optional with enableGlobalCache: true in .yarnrc.yml
# If .yarn directory exists and is needed, uncomment the line below:
# COPY .yarn ./.yarn

# Copy workspace package files
COPY apps/${BUILD_SERVICE}/package.json ./apps/${BUILD_SERVICE}/
COPY packages/design-system/package.json ./packages/design-system/

# Install dependencies
RUN yarn install --immutable

# Rebuild the source code only when needed
FROM base AS builder
ARG BUILD_SERVICE=admin
WORKDIR /app

# Enable Corepack
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

COPY --from=deps /app/node_modules ./node_modules
# .yarn directory not needed with global cache enabled

# Copy project files
COPY . .

# Build design-system first (dependency)
RUN yarn workspace @superline/design-system build

# Build the specified service
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn workspace @superline/${BUILD_SERVICE} build

# Production image, copy all the files and run next
FROM base AS runner
ARG BUILD_SERVICE=admin
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files from builder
COPY --from=builder /app/apps/${BUILD_SERVICE}/public ./apps/${BUILD_SERVICE}/public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/${BUILD_SERVICE}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${BUILD_SERVICE}/.next/static ./apps/${BUILD_SERVICE}/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV BUILD_SERVICE=${BUILD_SERVICE}

# Use shell form to allow variable expansion
CMD sh -c "node apps/${BUILD_SERVICE}/server.js"

