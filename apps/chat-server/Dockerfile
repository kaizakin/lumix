# Stage 1: Dependencies
FROM node:20-alpine AS builder
WORKDIR /app
# Install pnpm
RUN npm install -g pnpm@10.19.0
# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY apps/chat-server/package.json ./apps/chat-server/
RUN pnpm install --frozen-lockfile

COPY . .

# build shared package first
RUN pnpm --filter @repo/db build

# build chat server
RUN pnpm --filter chat-server build

# stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser 

# Copy workspace-level store plus package-level symlinks used by pnpm.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/chat-server ./apps/chat-server
COPY --from=builder /app/packages/db ./packages/db
COPY --from=builder /app/packages/types ./packages/types

# tell the application to run as this user.
USER appuser
EXPOSE 8080

WORKDIR /app/apps/chat-server
CMD [ "node", "dist/index.js" ]
