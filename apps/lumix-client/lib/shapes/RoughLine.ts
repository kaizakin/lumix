import rough from "roughjs/bin/rough";
import { RoughShape } from "./base/RoughShape";
import { RoughShapeProps } from "@/types/shapes";
// import { Drawable } from "roughjs/bin/core";

interface RoughLineProps extends RoughShapeProps {
    points?: number[]
}

export class RoughLine extends RoughShape {
    points: number[];

    constructor(config: RoughLineProps) {
        super(config);
        this.points = config.points || [0, 0, 0, 0];
    }

    generateDrawable() {
        const generator = rough.generator();

        // Ensure we have atleast 2 points (x1, y1, x2, y2) if not return a empty state.
        if (this.points.length < 4) {
            return generator.line(0, 0, 0, 0, {
                stroke: this.stroke() as string,
                strokeWidth: this.strokeWidth(),
                roughness: this.roughness,
                seed: this.seed
            });
        }

        const x1 = this.points[0];
        const y1 = this.points[1];
        const x2 = this.points[2];
        const y2 = this.points[3];

        return generator.line(x1 as number, y1 as number, x2 as number, y2 as number, {
            stroke: this.stroke() as string,
            strokeWidth: this.strokeWidth(),
            roughness: this.roughness,
            seed: this.seed
        });
    }

    // Override to update points
    setPoints(points: number[]) {
        this.points = points;
        this._clearCache();
    }

    getEndPoints() {
        return this.points;
    }
}