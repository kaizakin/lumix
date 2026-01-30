import rough from 'roughjs/bin/rough';
import { RoughShape } from './base/RoughShape';
import { RoughShapeProps } from '@/types/shapes';

export class RoughEllipse extends RoughShape {
    constructor(config: RoughShapeProps) {
        super(config);
    }

    generateDrawable() {
        const generator = rough.generator();
        const width = this.width();
        const height = this.height();

        return generator.ellipse(
            width / 2,
            height / 2,
            width,
            height,
            {
                stroke: this.stroke() as string,
                strokeWidth: this.strokeWidth(),
                roughness: this.roughness,
                seed: this.seed,
            }
        );
    }
    // Custom hit function to ensure the entire ellipse area is clickable
    _hitFunc(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.ellipse(
            this.width() / 2,
            this.height() / 2,
            this.width() / 2,
            this.height() / 2,
            0,
            0,
            Math.PI * 2
        );
        context.closePath();
        (context as any).fillStrokeShape(this);
    }
}