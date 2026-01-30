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
        this.hitStrokeWidth(20);
        this.points = [];
        const points = config.points || [0, 0, 0, 0];
        this.setPoints(points);
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
        if (points.length < 4) {
            this.points = points;
            return;
        }

        const x1 = points[0] as number;
        const y1 = points[1] as number;
        const x2 = points[2] as number;
        const y2 = points[3] as number;

        const minX = Math.min(x1, x2);
        const minY = Math.min(y1, y2);
        const maxX = Math.max(x1, x2);
        const maxY = Math.max(y1, y2);

        this.x(minX);
        this.y(minY);
        this.width(maxX - minX);
        this.height(maxY - minY);

        // Store relative points
        this.points = [
            x1 - minX,
            y1 - minY,
            x2 - minX,
            y2 - minY
        ];

        this._clearCache();
    }

    getEndPoints() {
        if (this.points.length < 4) return [0, 0, 0, 0];
        // Return absolute points
        return [
            (this.points[0] as number) + this.x(),
            (this.points[1] as number) + this.y(),
            (this.points[2] as number) + this.x(),
            (this.points[3] as number) + this.y()
        ];
    }

    // Custom hit function for line - adds a bit of buffer around the line
    _hitFunc(context: CanvasRenderingContext2D) {
        if (this.points.length < 4) return;

        const x1 = this.points[0];
        const y1 = this.points[1];
        const x2 = this.points[2];
        const y2 = this.points[3];

        context.beginPath();
        context.moveTo(x1 as number || 0, y1 as number || 0);
        context.lineTo(x2 as number || 0, y2 as number || 0);

        (context as any).fillStrokeShape(this);
    }
}