'use client';

import { useEffect, useRef, useState } from 'react';
import { ToolType } from '@/types/tools';
import { TOOLS } from '@/utils/constants';
import { Button } from '../ui/button';
import { LockKeyhole, LockOpen } from 'lucide-react';

interface ToolbarProps {
  selectedTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

export function Toolbar({ selectedTool, onToolChange }: ToolbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const highlight = highlightRef.current;
    if (!container || !highlight) return;

    const activeButton = container.querySelector( // custome attribute made job easier.
      `[data-tool="${selectedTool}"]`
    ) as HTMLElement;

    if (activeButton) {
      highlight.style.width = `${activeButton.offsetWidth}px`;
      highlight.style.transform = `translateX(${activeButton.offsetLeft}px)`;
    }
  }, [selectedTool]);

  return (
    <div className="w-full h-10 flex justify-center mt-2">
      <div
        ref={containerRef}
        className="relative flex w-max items-center justify-between bg-card p-3 border border-slate-800 rounded-md"
      >
        <Button
          variant={"ghost"}
          size={"sm"}
          className='focus:outline-none cursor-pointer'
          onClick={() => setIsLocked(!isLocked)}>
          {
            isLocked ?
              <LockKeyhole size={20} /> :
              <LockOpen size={20} />
          }
        </Button>

        {/*vertical seperator between toolbar*/}
        <div className="w-[1px] h-6 bg-gray-300 mx-2"></div>

        {/* Sliding highlight bar */}
        <div
          ref={highlightRef}
          className="absolute bottom-1 left-0 h-[2px] bg-blue-500 rounded transition-all duration-300 ease-in-out"
          style={{
            width: 0,
            transform: 'translateX(0)',
          }}
        />

        {TOOLS.map((tool) => (
          <button
            key={tool.type}
            data-tool={tool.type} // just an extra custom attribute im defining here to find the reference for highlight.
            onClick={() => onToolChange(tool.type as ToolType)}
            className={`relative p-1 focus:outline-none mx-2 rounded transition-colors cursor-pointer duration-200 ${selectedTool === tool.type
              ? 'text-blue-500'
              : 'hover:text-blue-400'
              }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
