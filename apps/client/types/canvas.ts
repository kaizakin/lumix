import { ToolType } from './tools';
import { ShapeConfig } from './shapes';

export interface CanvasState {
  tool: ToolType;
  shapes: ShapeConfig[];
  selectedShapeId: string | null;
  isDrawing: boolean;
  strokeColor: string;
  strokeWidth: number;
  roughness: number;
}

export interface Point {
  x: number;
  y: number;
}