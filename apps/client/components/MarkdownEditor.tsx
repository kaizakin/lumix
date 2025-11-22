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
  tablePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  diffSourcePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  InsertTable,
  DiffSourceToggleWrapper,
  imagePlugin,
  InsertImage,
  sandpackPlugin,
} from "@mdxeditor/editor";

export function MarkdownEditor() {
  const [markdown, setMarkdown] = useState<string>("### Start brainstorming now\n\nWrite your ideas here...");

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <MDXNoteEditor
          markdown={markdown}
          onChange={setMarkdown}
        />
      </div>
    </div>
  );
}

function MDXNoteEditor({
  markdown,
  onChange,
}: {
  markdown: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="h-full w-full flex flex-col  overflow-auto scrollbar-custom-thin">
      <MDXEditor
        markdown={markdown}
        onChange={onChange}
        className="dark-editor dark-theme"
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <InsertTable />
                <InsertImage />
              </DiffSourceToggleWrapper>
            ),
          }),
          headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4, 5, 6] }),
          listsPlugin(),
          quotePlugin(),
          linkPlugin(),
          tablePlugin(),
          imagePlugin(),
          thematicBreakPlugin(),
          sandpackPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: 'JavaScript',
              ts: 'TypeScript',
              jsx: 'JSX',
              tsx: 'TSX',
              css: 'CSS',
              html: 'HTML',
              json: 'JSON',
              md: 'Markdown',
              py: 'Python',
              sh: 'Shell',
              txt: 'Plain Text'
            }
          }),
          markdownShortcutPlugin(),
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
        ]}
        contentEditableClassName="prose prose-invert max-w-none text-sm bg-black focus:outline-none min-h-full p-4"
      />
    </div>
  );
}