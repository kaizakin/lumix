import rough from 'roughjs/bin/rough';
import { RoughShape } from './base/RoughShape';
import { RoughShapeProps } from '@/types/shapes';

export class RoughRectangle extends RoughShape {
  constructor(config: RoughShapeProps) {
    super(config);
  }

  // This function creates a drawable aka set of rough instructions to draw a rectangle.
  generateDrawable() {
    const generator = rough.generator();// roughjs generator.
    const width = this.width();
    const height = this.height();

    return generator.rectangle(0, 0, width, height, {
      stroke: this.stroke() as string,
      strokeWidth: this.strokeWidth(),
      roughness: this.roughness,
      seed: this.seed,
    });
  }

  // Custom hit function to ensure the entire rectangle area is clickable
  _hitFunc(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.rect(0, 0, this.width(), this.height());
    context.closePath();
    (context as any).fillStrokeShape(this);
  }
}