import React from "react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { history, historyKeymap } from "@milkdown/kit/plugin/history";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import "@milkdown/theme-nord/style.css";

const DEFAULT_TEXT = `# Welcome to the editor

- Start typing to see the Nord theme
- Content will scroll when it grows
- Undo (Ctrl/Cmd+Z), Redo (Ctrl/Cmd+Y)
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
      })
      .use(commonmark)
      .use(history)
  );

  return (
    // <div className="rounded border border-neutral-700 bg-[#2e3440] p-3">
    // <div className="min-h-75 max-h-150 overflow-y-auto">
    <Milkdown />
    // </div>
    // </div>
  );
};

export const MarkdownEditor: React.FC = () => (
  <MilkdownProvider>
    <MilkdownEditor />
  </MilkdownProvider>
);