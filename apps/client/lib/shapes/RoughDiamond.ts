import rough from 'roughjs/bin/rough';
import { RoughShape } from './base/RoughShape';
import { RoughShapeProps } from '@/types/shapes';

export class RoughDiamond extends RoughShape {
  constructor(config: RoughShapeProps) {
    super(config);
  }

  generateDrawable() {
    const generator = rough.generator();
    const width = this.width();
    const height = this.height();

    const points = [
      [width / 2, 0],
      [width, height / 2],
      [width / 2, height],
      [0, height / 2],
    ];

    return generator.polygon(points as [number, number][], {
      stroke: this.stroke() as string,
      strokeWidth: this.strokeWidth(),
      roughness: this.roughness,
      seed: this.seed,
    });
  }
  // Custom hit function to ensure the entire diamond area is clickable
  _hitFunc(context: CanvasRenderingContext2D) {
    const width = this.width();
    const height = this.height();

    context.beginPath();
    context.moveTo(width / 2, 0);
    context.lineTo(width, height / 2);
    context.lineTo(width / 2, height);
    context.lineTo(0, height / 2);
    context.closePath();
    (context as any).fillStrokeShape(this);
  }
}