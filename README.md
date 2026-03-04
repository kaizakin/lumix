# Lumix

[![wakatime](https://wakatime.com/badge/github/kaizakin/lumix.svg)](https://wakatime.com/badge/github/kaizakin/lumix)

Lumix is a full-stack, real-time collaboration platform where teams work inside shared "Pods".  
Each pod combines synchronous chat, collaborative writing, lightweight video rooms, and shared file space in one workspace.

This repository is a production-style monorepo with clear separation of concerns across frontend, real-time backend, and shared packages.

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
                        |        Next.js Client        |
                        |  app routes + server actions |
                        +---------------+--------------+
                                        |
                     HTTP (API routes)  |  Socket.IO (/chat)
                                        |
                +-----------------------+----------------------+
                |                                              |
    +-----------v-----------+                      +-----------v-----------+
    |   Prisma + Postgres   |                      |  Chat Server (Node)   |
    |  users/pods/messages  |                      |  Socket.IO + Redis    |
    +-----------+-----------+                      +-----------+-----------+
                |                                              |
                |                                              |
                |                                  +-----------v-----------+
                |                                  |        Redis          |
                |                                  | cache + fanout adapter|
                |                                  +-----------------------+
                |
    +-----------v-----------+
    |   Supabase Storage    |
    |  pod file blobs       |
    +-----------------------+
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

## Deep Technical Highlights

### 1. Real-time messaging pipeline

- Client emits `send_message` through a pod-scoped socket connection.
- Server persists to Postgres (`ChatMessage`) and updates Redis cache.
- New message is broadcast to the pod room via Socket.IO.
- Client applies optimistic updates and reconciles with server responses.

### 2. Redis-backed message retrieval

- `fetch_messages` first checks `chat:<pod>:messages` in Redis.
- On cache miss, server reads ordered chat history from Postgres and backfills Redis.
- This reduces repeated DB reads on reconnect/load.

### 3. Collaborative editor sync (Yjs)

- Editor local state is a Yjs document.
- Updates are emitted as binary payloads through `yjs-update` socket events.
- Server applies updates and relays to peers in the same editor room.

### 4. Transactional domain modeling

Pod creation uses a Prisma transaction to guarantee consistency:

1. create `Pod`
2. connect creator as a member
3. create matching `ChatGroup`

This avoids partially-created workspace state.

### 5. File handling strategy

- Binary files are stored in Supabase object storage.
- Relational metadata (`PodFile`) stays in Postgres for queryability.
- Downloads are issued through signed URLs (short-lived access).

## Data Model (Prisma)

Core entities:

- `User`, `Account`, `Session`, `VerificationToken` (NextAuth)
- `Pod` (owner + members relation)
- `ChatGroup` (1:1 with pod)
- `ChatMessage`
- `Invite`
- `PodFile`

## Engineering Decisions

- Shared packages (`@repo/db`, `@repo/types`) keep contracts consistent across apps.
- Prisma is wrapped once in `packages/db` and consumed from both frontend server code and chat server.
- Next.js transpiles `@repo/db` explicitly to avoid monorepo runtime boundary issues.
- Zustand handles fast local UI state (tab/panel switching), while React Query manages async server state.

## Tech Stack

- Frontend: Next.js 16, React 19, Tailwind CSS v4, Radix UI
- Auth: NextAuth v5 + Prisma Adapter + OAuth (GitHub, Google)
- Realtime: Socket.IO + Redis Streams adapter
- Collaboration: Milkdown + Yjs
- Video: Ion SDK JS (SFU client)
- Database: Postgres + Prisma 7
- File Storage: Supabase Storage
- Tooling: pnpm workspaces + Turborepo + TypeScript
