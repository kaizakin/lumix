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
}