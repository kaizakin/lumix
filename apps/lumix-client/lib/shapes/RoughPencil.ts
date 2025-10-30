import rough from 'roughjs/bin/rough';
import { RoughShape } from './base/RoughShape';
import { RoughShapeProps } from '@/types/shapes';
import { Drawable } from 'roughjs/bin/core';

interface RoughPencilProps extends RoughShapeProps {
  points?: number[];
}

// Uses an array of points to create a smooth curved path

export class RoughPencil extends RoughShape {
  points: number[];

  constructor(config: RoughPencilProps) {
    super(config);
    this.points = config.points || [];
  }

  generateDrawable(): Drawable {
    const generator = rough.generator();
    
    // Need at least 2 points to draw
    if (this.points.length < 4) {
      return generator.linearPath([[0, 0], [0, 0]],{ // a empty drawing
        stroke: this.stroke() as string,
        strokeWidth: this.strokeWidth(),
        roughness: this.roughness,
        seed: this.seed
      });
    }

    // Convert flat array [x1, y1, x2, y2, x3, y3...] to points array
    const pointPairs: [number, number][] = [];
    for (let i = 0; i < this.points.length; i += 2) {
      pointPairs.push([this.points[i] as number, this.points[i + 1] as number]);
    }

    // Use linearPath for smooth freehand drawing
    return generator.linearPath(pointPairs, {
      stroke: this.stroke() as string,
      strokeWidth: this.strokeWidth(),
      roughness: this.roughness,
      seed: this.seed,
    });
  }

  // Add a new point to the path
  addPoint(x: number, y: number) {
    this.points.push(x, y);
    this._clearCache();  // Force redraw
  }

  // Update all points at once
  setPoints(points: number[]) {
    this.points = points;
    this._clearCache();
  }

  getPoints() {
    return this.points;
  }

  // Smooth the path
  smoothPath() {
    if (this.points.length < 6) return;// cant really smooth a line that is less than 3 points.

    const smoothed: number[] = [];
    smoothed.push(this.points[0] as number, this.points[1] as number);// add first point

    for (let i = 2; i < this.points.length - 2; i += 2) {
      const x = (this.points[i] as number + (this.points[i + 2] as number)) / 2;// creating a jagggy poing by averaging between next and current.
      const y = (this.points[i + 1] as number + (this.points[i + 3] as number)) / 2;
      smoothed.push(x, y);
    }

    // Add last point with type assertion since we checked length >= 4
    if (this.points.length >= 4) {
      smoothed.push(
        this.points[this.points.length - 2] as number,
        this.points[this.points.length - 1] as number
      );
    }

    this.points = smoothed;
    this._clearCache();
  }
}