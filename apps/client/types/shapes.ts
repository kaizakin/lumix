import Konva from 'konva';
// import { Drawable } from 'roughjs/bin/core';

export interface ShapeConfig {
  id: string;
  type: 'rectangle' | 'ellipse' | 'diamond' | 'arrow' | 'line' | 'pen' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: number[];
  stroke: string;
  strokeWidth: number;
  roughness: number;
  seed?: number;
  text?: string;         // For text content
  fontSize?: number;     // For text size
  fontFamily?: string;   // For text font
}


// extending the konva shape to add roughjs implementation for the shapes 
export interface RoughShapeProps extends Konva.ShapeConfig {
  roughness?: number;
  seed?: number;
}