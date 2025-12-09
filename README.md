# Lumix

This is a collaborative, realtime brainstorming application designed to help teams work together seamlessly in what I call "Pods".

Think of it as your digital war room where you can whiteboard, chat, video call, and manage tasks all in one beautiful, dark-themed interface. I'm going for a super modern, "next-gen" look with a touch of teal.

## What is this project?

The goal of Lumix is to bring everything a team needs into one place. No more switching between a whiteboard app, a video call app, and a chat app. It's all here, synced in realtime.

I'm focusing heavily on the **Pod Page** – the main workspace where the magic happens.

## Tech Stack 

I'm using some cool tech to make this happen:

*   **Frontend**: Next.js (React), TailwindCSS, Framer Motion (for those smooth transitions).
*   **Realtime**: Socket.io and Redis (for chat caching and rate limiting).
*   **Whiteboard**: Konva.js for the canvas.
*   **Collaboration**: Yjs (planned) for realtime state syncing.
*   **Video/Audio**: WebRTC with SFU (planned).
*   **Storage**: Supabase (planned for file sharing).
*   **Database**: Prisma.(ORM)

## Roadmap & Features 

Here is where the project is currently at. Some things are ready to go, and others are in the works!

### Core Features
- [x] **Realtime Whiteboard UI**: Canvas implementation with Konva.js.
- [ ] **Whiteboard Sync**: Realtime syncing using Yjs (CRDT).
- [x] **Group Chat**: Realtime chat with Pod members using WebSockets & Redis.
- [ ] **Video Call**: Multi-user video calls using WebRTC & SFU.
- [ ] **Audio Call**: Crystal clear audio calls with your team.
- [ ] **File Sharing**: Upload and share files via Supabase.

### Productivity & AI
- [x] **Markdown Editor**: Write down your plans with auto-sync.
- [ ] **AI Assistant**: A built-in bot to help manage tasks, add members, and mark deadlines.
- [ ] **Deadline Management**: Visual markers for important dates.

### UI/UX
- [x] **Modern Dark Theme**: Sleek dark mode with Teal accents.
- [x] **Smooth Transitions**: Animations using Framer Motion.
- [x] **Responsive Layout**: Perfect layout for the Pod interface.

## Project Structure 

Here is a quick look at how the project is organized:

```text
lumix/
├── apps/
│   ├── client/              # Next.js Frontend application
│   │   ├── app/             # Pages and Routes
│   │   └── components/      # React Components (Canvas, Chat, UI)
│   └── chat-server/         # Realtime Chat Server
│       └── src/             # Socket.io & Redis logic
└── packages/
    ├── db/                  # Prisma Schema & DB Client
    ├── types/               # Shared Types across apps
    └── config/              # Shared configurations
```

## I'm not accepting any PR's or issues at the moment 😅
