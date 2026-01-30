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
    this.hitStrokeWidth(20);
    this.points = [];
    const points = config.points || [];
    this.setPoints(points);
  }

  generateDrawable(): Drawable {
    const generator = rough.generator();

    // Need at least 2 points to draw
    if (this.points.length < 4) {
      return generator.linearPath([[0, 0], [0, 0]], { // a empty drawing
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
    // This is called during drawing, so inputs are absolute mouse coordinates.
    // We need to re-normalize the entire path because adding a point might change the bounding box (e.g. dragging left/up)

    // Get current absolute points
    const absPoints = this.getPoints();
    absPoints.push(x, y);

    // Recalculate everything
    this.setPoints(absPoints);
  }

  // Update all points at once
  setPoints(points: number[]) {
    if (points.length < 2) {
      this.points = points;
      return;
    }

    // Find bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];

      if (x !== undefined && y !== undefined) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }

    // Safety check if no valid points found
    if (minX === Infinity || minY === Infinity) {
      this.points = points;
      return;
    }

    // Update shape transform
    this.x(minX);
    this.y(minY);
    this.width(maxX - minX);
    this.height(maxY - minY);

    // Convert to relative points
    const relativePoints = [];
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      if (x !== undefined && y !== undefined) {
        relativePoints.push(x - minX);
        relativePoints.push(y - minY);
      }
    }

    this.points = relativePoints;
    this._clearCache();
  }

  getPoints() {
    // Return absolute points
    const points: number[] = [];
    const x = this.x();
    const y = this.y();

    for (let i = 0; i < this.points.length; i += 2) {
      const px = this.points[i];
      const py = this.points[i + 1];
      if (px !== undefined && py !== undefined) {
        points.push(px + x);
        points.push(py + y);
      }
    }
    return points;
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
  // Custom hit function for pencil
  _hitFunc(context: CanvasRenderingContext2D) {
    if (this.points.length < 2) return;

    context.beginPath();
    context.moveTo(this.points[0] as number, this.points[1] as number);

    for (let i = 2; i < this.points.length; i += 2) {
      context.lineTo(this.points[i] as number, this.points[i + 1] as number);
    }

    (context as any).fillStrokeShape(this);
  }
}