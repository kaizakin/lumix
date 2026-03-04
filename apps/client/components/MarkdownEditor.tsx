import React from "react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { gfm } from "@milkdown/kit/preset/gfm";
import { history, historyKeymap } from "@milkdown/kit/plugin/history";
import { clipboard } from "@milkdown/kit/plugin/clipboard";
import { cursor } from '@milkdown/kit/plugin/cursor'
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import { indent } from '@milkdown/kit/plugin/indent'
import "@milkdown/theme-nord/style.css"
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
import { collab, collabServiceCtx, CollabReady } from "@milkdown/plugin-collab";
import { usePodSocket } from "@/components/providers/PodSocketProvider";
import { useEffect, useMemo, useState, useRef } from "react";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";


const DEFAULT_TEXT = `# Welcome to your Markdown Editor

This editor is powered by **Milkdown**. It supports CommonMark and GFM.

## Features

-   **Rich Text Styling**: *Italic*, **Bold**, ~~Strikethrough~~
-   **Lists**:
    - item1
    - item2 

<br/>

1. Numbered lists
    1. item1
    2. item2

<br/>

-   **Code Blocks**:

\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

<br/>

> "The best way to predict the future is to create it." - Peter Drucker

<br/>

Start capturing your ideas here!
`;
const DEBUG_EDITOR_SYNC = process.env.NEXT_PUBLIC_DEBUG_EDITOR_SYNC === "1";

function normalizeYjsUpdate(update: unknown): Uint8Array | null {
  if (!update) return null;
  if (update instanceof Uint8Array) return update;
  if (Array.isArray(update)) return Uint8Array.from(update);
  if (update instanceof ArrayBuffer) return new Uint8Array(update);
  if (typeof update === "object") {
    const maybeBuffer = update as { type?: string; data?: number[] };
    if (maybeBuffer.type === "Buffer" && Array.isArray(maybeBuffer.data)) {
      return Uint8Array.from(maybeBuffer.data);
    }
  }
  return null;
}

const MilkdownEditor: React.FC = () => {
  const { socket, isConnected, podId } = usePodSocket();
  const collabServiceRef = useRef<any>(null); // Using any to avoid complex type imports for now
  const joinedRoomRef = useRef<string | null>(null);
  const templateAppliedRef = useRef(false);
  const [editorReady, setEditorReady] = useState(false);

  const { ydoc, awareness } = useMemo(() => {
    const doc = new Y.Doc();
    const aware = new Awareness(doc);
    return { ydoc: doc, awareness: aware };
  }, []);

  useEffect(() => {
    templateAppliedRef.current = false;
  }, [podId]);

  useEffect(() => {
    if (!socket || !isConnected || !editorReady || !collabServiceRef.current) return;

    try {
      // Bind doc and awareness
      collabServiceRef.current.bindDoc(ydoc).setAwareness(awareness);

      // Connect
      collabServiceRef.current.connect();
    } catch (error) {
      console.error("Collab service failed to connect:", error);
      return;
    }

    // Existing Socket Logic
    console.log("Joining editor room. Socket ID:", socket.id);

    function onYjsUpdate(update: unknown) {
      const normalized = normalizeYjsUpdate(update);
      if (!normalized) return;
      try {
        Y.applyUpdate(ydoc, normalized, "remote");
        if (DEBUG_EDITOR_SYNC) {
          console.log("[editor-debug] received yjs-update", { bytes: normalized.byteLength, roomId });
        }
      } catch (error) {
        console.error("[editor-debug] failed applying remote yjs update", error);
      }
    }

    function onDocUpdate(update: Uint8Array, origin: any) {
      if (origin === "remote") return;
      socket?.timeout(3000).emit("yjs-update", Array.from(update), (err: unknown, response: any) => {
        if (DEBUG_EDITOR_SYNC) {
          if (err) {
            console.error("[editor-debug] emit yjs-update timeout/error", err);
          } else {
            console.log("[editor-debug] server ack for yjs-update", response);
          }
        }
      });
    }

    const roomId = `editor:${podId ?? "default"}`;
    const onEditorDebug = (payload: unknown) => {
      if (DEBUG_EDITOR_SYNC) {
        console.log("[editor-debug] server event", payload);
      }
      if (
        typeof payload === "object" &&
        payload !== null &&
        "phase" in payload &&
        "isNewDoc" in payload
      ) {
        const event = payload as { phase?: string; isNewDoc?: boolean };
        if (event.phase === "join" && event.isNewDoc && !templateAppliedRef.current) {
          collabServiceRef.current?.applyTemplate(DEFAULT_TEXT);
          templateAppliedRef.current = true;
        }
      }
    };
    const joinKey = `${socket.id ?? "no-socket"}:${roomId}`;
    if (joinedRoomRef.current !== joinKey) {
      socket.emit("join-editor", roomId);
      joinedRoomRef.current = joinKey;
    }
    socket.on("yjs-update", onYjsUpdate)
    socket.on("editor-debug", onEditorDebug);
    ydoc.on("update", onDocUpdate)

    return () => {
      collabServiceRef.current?.disconnect();
      socket.off("yjs-update", onYjsUpdate);
      socket.off("editor-debug", onEditorDebug);
      ydoc.off("update", onDocUpdate);
    }
  }, [socket, isConnected, podId, editorReady, ydoc, awareness])

  useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        try {
          nord(ctx);
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, DEFAULT_TEXT);
          ctx.set(historyKeymap.key, {
            Undo: { shortcuts: "Mod-z" },
            Redo: { shortcuts: ["Mod-y", "Shift-Mod-z"] },
          });
          ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
            console.log("Milkdown detected change", markdown.length);
          });

          // Collab service is only context-bound after CollabReady.
          void ctx.wait(CollabReady)
            .then(() => {
              const service = ctx.get(collabServiceCtx);
              collabServiceRef.current = service;
              setEditorReady(true);
            })
            .catch((error) => {
              console.error("Failed waiting for CollabReady:", error);
            });
        } catch (error) {
          console.error("Error configuring Milkdown:", error);
        }
      })
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(clipboard)
      .use(cursor)
      .use(indent)
      .use(listener)
      .use(collab),
    [ydoc, awareness]
  );

  return (
    <Milkdown />
  );
};

export const MarkdownEditor: React.FC = () => (
  <MilkdownProvider>
    <MilkdownEditor />
  </MilkdownProvider>
);
