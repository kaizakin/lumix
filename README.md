<p align="center">
  <b style="color: red;">Lumix</b>
</p>

[![wakatime](https://wakatime.com/badge/github/kaizakin/lumix.svg)](https://wakatime.com/badge/github/kaizakin/lumix)

Lumix is a full-stack collaboration platform built as a production-style monorepo. The product model is simple: teams work inside shared Pods that combine chat, collaborative editing, file sharing, and video.

This repository is interesting from an engineering standpoint because it treats real-time collaboration, data consistency, and deployment ergonomics as first-class concerns.


## About This Project

- Real-time system design, not just UI polish:
  - Socket.IO room topology
  - Redis-backed message caching
  - persistent chat storage in Postgres
- Collaborative editing pipeline using Yjs event propagation over sockets.
- Transactional backend workflows (pod + chat group creation in a single DB transaction).
- Monorepo architecture with shared types and shared database package.
- Full auth system (NextAuth + Prisma Adapter + OAuth providers).
- File storage flow with signed URLs and metadata persistence.

## Product Capabilities

- Pods: create/join team workspaces with invite codes.
- Chat: real-time messaging with optimistic UI and history replay.
- Collaborative markdown editor: live synced updates via Yjs.
- Video panel: SFU client integration (Ion SDK).
- File sharing: upload/download within each pod.
- Personal dashboard: pod stats and workspace overview.


## Architecture

```text
                              +------------------------------+
                              |         Browser Client       |
                              |         (Next.js App)        |
                              +---------------+--------------+
                                              |
                         HTTP (App Routes / API Routes)
                         Socket.IO (Realtime Channel)
                                              |
                    +-------------------------v-------------------------+
                    |                  Client Service                   |
                    |                    apps/client                    |
                    |  - NextAuth authentication                        |
                    |  - Prisma access via @repo/db                     |
                    |  - API routes + server actions                    |
                    +-------------------+-------------------------------+
                                        |
                                        |
                            +-----------v-----------+
                            |       Postgres        |
                            |   System of Record    |
                            | users / pods / msgs   |
                            +-----------------------+


                    Realtime + Collaboration Layer
                                        |
                    +-------------------v-------------------+
                    |              Socket Service           |
                    |            apps/chat-server           |
                    |  - Socket.IO server                   |
                    |  - Redis Streams adapter              |
                    |  - Yjs update relay                   |
                    |  - Chat history orchestration         |
                    +-------------------+-------------------+
                                        |
                            +-----------v-----------+
                            |         Redis         |
                            | realtime coordination |
                            |   pub/sub + caching   |
                            +-----------------------+


                              Auxiliary Infrastructure
                                        |
             +--------------------------+---------------------------+
             |                                                      |
   +---------v----------+                               +-----------v-----------+
   |      Ion SFU       |                               |    Supabase Storage  |
   | video signaling    |                               |   object/file blobs  |
   | media forwarding   |                               |   attachments/files  |
   +--------------------+                               +----------------------+
```

## Monorepo Structure

```text
.
├── apps/
│   ├── client/        # Next.js 16 app (frontend + app/api + server actions)
│   └── chat-server/   # Express + Socket.IO real-time backend
├── packages/
│   ├── db/            # Prisma schema, migrations, generated client wrapper
│   ├── types/         # Shared TypeScript contracts for chat payloads
│   ├── eslint-config/ # Shared lint config
│   └── typescript-config/
└── turbo.json         # Turborepo task graph
```

## Technical POV

The core design choice is to keep domain ownership explicit:

- `apps/client` owns product UX, auth flows, API routes, and server actions.
- `apps/chat-server` owns low-latency socket workloads and real-time fanout.
- `packages/db` owns Prisma schema, migrations, and database access.
- `packages/types` owns cross-service type contracts.

That separation keeps the client focused on product velocity while moving stateful socket concerns into a dedicated runtime.

## Data And Consistency Model

Prisma models capture auth, workspace, and collaboration domains:

- Auth: `User`, `Account`, `Session`, `VerificationToken`
- Workspace: `Pod`, `Invite`, `PodFile`
- Realtime content: `ChatGroup`, `ChatMessage`
- Collaborative state: `EditorDocument`, `CanvasDocument`

Operationally relevant decisions:

- Pod creation is handled transactionally to avoid partial workspace state.
- Chat messages are durable in Postgres and replayable on reconnect.
- Editor/canvas state is persisted by pod, enabling warm restoration.

## Realtime Design

`apps/chat-server` is purpose-built for socket workloads:

- Socket.IO handles room topology and event routing.
- Redis Streams adapter enables distributed fanout semantics.
- Server falls back to Postgres on cache miss, then rehydrates cache.
- Yjs payloads are relayed as binary updates to keep collaboration responsive.

Result: low-latency collaboration without forcing the web app runtime to carry socket state complexity.

## Monorepo And Build System

The repo uses `pnpm` workspaces + Turborepo:

- Shared packages (`@repo/db`, `@repo/types`) are consumed by both apps.
- Build ordering ensures Prisma client generation and DB package build happen before app builds.
- TypeScript and lint config are centralized in reusable workspace packages.

This setup minimizes duplication while keeping boundaries explicit.

## Containerization Strategy

### `apps/client/Dockerfile`

- Multi-stage build on `node:20-alpine`.
- Installs workspace dependencies once via `pnpm`.
- Builds `@repo/db` first, then builds Next.js app.
- Runtime image uses non-root `nextjs` user.
- Ships Next.js standalone output for smaller runtime footprint.

### `apps/chat-server/Dockerfile`

- Multi-stage build for workspace-aware dependency install + TypeScript compile.
- Builds shared `@repo/db` package before chat-server build.
- Runtime image runs as non-root `appuser`.
- Starts compiled server from `dist/index.js`.

### `PrismaMigration.Dockerfile`

- Minimal purpose-specific image for migration execution only.
- Copies Prisma schema + `prisma.config.ts`.
- Installs `prisma` and `dotenv` so config loading is deterministic.
- Runs `prisma migrate deploy` as the container entry command.

## Compose Topology (`docker-compose.yaml`)

Defined services:

- `postgres` (`postgres:15-alpine`) with persistent volume.
- `redis` (`redis:7-alpine`) for realtime/cache workloads.
- `migrate` one-shot migration service.
- `chat-server` (depends on `postgres`, `redis`, `migrate`).
- `client` (depends on `postgres`, `chat-server`, `migrate`, `sfu`).
- `sfu` (`pionwebrtc/ion-sfu`) for video transport layer.

Important runtime detail:

- Migration uses `DIRECT_URL` in Prisma config.
- App services use `DATABASE_URL` for regular query traffic.

## Local Runbook

### Prerequisites

- Docker + Docker Compose
- `.env` values for auth and external service keys

### Boot sequence

```bash
docker compose build
docker compose up -d
```

### Run migrations explicitly

```bash
docker compose build --no-cache migrate
docker compose run --rm migrate
```

### Stop stack

```bash
docker compose down
```

## Why This Repo Signals Senior Engineering

- Clear service boundaries between product runtime and realtime runtime.
- Pragmatic consistency guarantees with transactional domain operations.
- Purpose-built migration container instead of coupling schema rollout to app boot.
- Non-root runtime containers and multi-stage builds across services.
- Monorepo sharing done with disciplined package boundaries, not ad-hoc imports.
