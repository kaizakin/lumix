import { IconHandStop } from "@tabler/icons-react";
import { ArrowRight, Circle, Diamond, Eraser, LetterTextIcon, Minus, MousePointer2, Pencil, Square } from "lucide-react";

export const CANVAS_CONFIG = {
  width: typeof window !== 'undefined' ? window.innerWidth : 1920,
  height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  backgroundColor: '#ffffff',
};

export const DEFAULT_SHAPE_CONFIG = {
  stroke: '#FFFFFF',
  strokeWidth: 2,
  roughness: 1,
};


export const DEFAULT_TEXT_CONFIG = {
  fontSize: 20,
  fontFamily: 'Virgil, sans-serif',  // Excalidraw-like handwriting font
  fill: '#000000',
};

export const TOOLS = [
  { type: 'hand', icon: <IconHandStop size={20} />, label: 'hand' },
  { type: 'selection', icon: <MousePointer2 size={20} />, label: 'Select' },
  { type: 'rectangle', icon: <Square size={20} />, label: 'Rectangle' },
  { type: 'ellipse', icon: <Circle size={20} />, label: 'Ellipse' },
  { type: 'diamond', icon: <Diamond size={20} />, label: 'Diamond' },
  { type: 'arrow', icon: <ArrowRight size={20} />, label: 'Arrow' },
  { type: 'line', icon: <Minus size={20} />, label: 'Line' },
  { type: 'pencil', icon: <Pencil size={20} />, label: 'Pencil' },
  { type: 'text', icon: <LetterTextIcon size={20} />, label: 'Text' },
  { type: 'eraser', icon: <Eraser size={20} />, label: 'Eraser' },
];

export const ERASER_CONFIG = {
  cursorSize: 5,      // Visual size of eraser cursor
  hitRadius: 10,       // Detection radius (smaller = more precise)
};