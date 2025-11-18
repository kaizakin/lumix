"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// MDXEditor needs client-side loading
const MDXEditor = dynamic(
  () => import("@mdxeditor/editor").then((mod) => mod.MDXEditor),
  { ssr: false }
);

// Import plugins and toolbar components
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  diffSourcePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  InsertCodeBlock,
  InsertThematicBreak,
} from "@mdxeditor/editor";

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState<string>("### Start brainstorming now\n\nWrite your ideas here...");

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <MDXNoteEditor markdown={markdown} onChange={setMarkdown} />
      </div>
    </div>
  );
}

function MDXNoteEditor({ markdown, onChange }: { markdown: string; onChange: (value: string) => void }) {
  return (
    <div className="h-full w-full flex flex-col text-whit overflow-auto scrollbar-custom-thin">
      <MDXEditor
        markdown={markdown}
        onChange={onChange}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <ListsToggle />
                <CreateLink />
                <InsertTable />
                <InsertCodeBlock />
                <InsertThematicBreak />
              </>
            ),
          }),
          listsPlugin(),
          quotePlugin(),
          headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4, 5, 6] }),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
          codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', ts: 'TypeScript', jsx: 'JSX', tsx: 'TSX', css: 'CSS', html: 'HTML', json: 'JSON', md: 'Markdown', py: 'Python', sh: 'Shell' } }),
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
        ]}
        className="mdxeditor-root h-full w-full prose prose-invert max-w-none text-white"
        contentEditableClassName="prose prose-invert max-w-none focus:outline-none min-h-full p-4"
      />
    </div>
  );
}