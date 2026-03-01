# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
# Install pnpm
RUN npm install -g pnpm@10.19.0
# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY apps/chat-server/package.json ./apps/chat-server/
RUN pnpm install --frozen-lockfile

# stage 2: builder
FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@10.19.0
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# build shared package first
RUN pnpm build --filter @repo/db build

# build chat server
RUN pnpm build --filter chat-server build

# stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system nodejs --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser 

# copy built deps
COPY --from=builder /app/apps/chat-server/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/node_modules ./packages/node_modules

# tell the application to run as this user.
USER appuser
EXPOSE 8080

CMD [ "node", "dist/index.js" ]

