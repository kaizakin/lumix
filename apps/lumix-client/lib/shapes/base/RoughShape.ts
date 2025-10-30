import Konva from 'konva';
// import rough from 'roughjs/bin/rough';
import { drawRoughPath } from '@/utils/roughToCanvas';
import { RoughShapeProps } from '@/types/shapes';
import { Drawable } from 'roughjs/bin/core';

// creating custom rough shapes by extending konva.shape class making it abstract so no direct instantiation is possible
// other shapes can extend it and fill the holes to form a complete shape. 
export abstract class RoughShape extends Konva.Shape {
  roughness: number;
  seed?: number;

  constructor(config: RoughShapeProps) {
    super(config); // call konva.Shape that sets up all Konva stuff (like x, y, width, etc.)
    this.roughness = config.roughness || 1;
    this.seed = config.seed || Math.random() * 1000;
  }

  // every subclass that extends this must implement its own generateDrawable method.
  abstract generateDrawable(): Drawable;

  // _sceneFunc() is a special Konva method that you override when you want **full control** over how your shape is drawn.
  // The underscore prefix (_) means it’s an internal method, not meant to be called by you directly.
  // But Konva uses it internally when rendering your shape to the canvas.

  _sceneFunc(context: CanvasRenderingContext2D) {
    const drawable = this.generateDrawable();

    // if drawable exists it passes it to drawRoughPath for drawing in the canvas.
    if (drawable) {
      drawRoughPath(context, drawable);
    }
  }
}