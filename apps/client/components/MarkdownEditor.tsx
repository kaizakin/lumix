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
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
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

const MilkdownEditor: React.FC = () => {
  const { socket, isConnected } = usePodSocket();
  const collabServiceRef = useRef<any>(null); // Using any to avoid complex type imports for now
  const [editorReady, setEditorReady] = useState(false);

  const { ydoc, awareness } = useMemo(() => {
    const doc = new Y.Doc();
    const aware = new Awareness(doc);
    return { ydoc: doc, awareness: aware };
  }, []);

  useEffect(() => {
    if (!socket || !isConnected || !editorReady || !collabServiceRef.current) return;

    // Bind doc and awareness
    collabServiceRef.current.bindDoc(ydoc).setAwareness(awareness);

    // Connect
    collabServiceRef.current.connect();

    // Existing Socket Logic
    console.log("Joining editor room. Socket ID:", socket.id);

    function onYjsUpdate(update: Uint8Array) {
      // console.log("Received yjs-update from server", update.byteLength);
      const uint8Update = new Uint8Array(update);
      Y.applyUpdate(ydoc, uint8Update, "remote");
    }

    function onDocUpdate(update: Uint8Array, origin: any) {
      if (origin === "remote") return;
      // console.log("Local ydoc updated, emitting to server", update.byteLength);
      socket?.emit("yjs-update", update)
    }

    socket.emit("join-editor", "room-1")
    socket.on("yjs-update", onYjsUpdate)
    ydoc.on("update", onDocUpdate)

    return () => {
      collabServiceRef.current?.disconnect();
      socket.off("yjs-update", onYjsUpdate);
      ydoc.off("update", onDocUpdate);
    }
  }, [socket, isConnected, editorReady, ydoc, awareness])

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

          console.log("Getting collab service instance...");
          const service = ctx.get(collabServiceCtx);
          if (service) {
            collabServiceRef.current = service;
            setEditorReady(true);
          } else {
            console.error("Failed to get collab service instance");
          }
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