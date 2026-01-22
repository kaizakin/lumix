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
  useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        nord(ctx);
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, DEFAULT_TEXT);
        ctx.set(historyKeymap.key, {
          Undo: { shortcuts: "Mod-z" },
          Redo: { shortcuts: ["Mod-y", "Shift-Mod-z"] },
        });
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
          // console.log(markdown);
        });
      })
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(clipboard)
      .use(cursor)
      .use(indent)
      .use(listener)
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