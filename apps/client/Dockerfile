FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable Corepack for Yarn
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

# Copy root package files
COPY package.json yarn.lock* .yarnrc.yml ./
COPY .yarn ./.yarn

# Copy workspace package files
COPY apps/client/package.json ./apps/client/
COPY packages/design-system/package.json ./packages/design-system/

# Install dependencies
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Enable Corepack
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn

# Copy project files
COPY . .

# Build design-system first (dependency)
RUN yarn workspace @superline/design-system build

# Build client app
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn workspace @superline/client build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files from builder
COPY --from=builder /app/apps/client/public ./apps/client/public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/client/server.js"]
