import Konva from 'konva';
import rough from 'roughjs/bin/rough';
import { drawRoughPath } from '@/utils/roughToCanvas';
import { RoughShapeProps } from '@/types/shapes';

interface RoughArrowProps extends RoughShapeProps {
  points?: number[];
  arrowSize?: number;
}

// arrow contains two shapes so render it in grp
export class RoughArrow extends Konva.Group {
  points: number[];
  arrowSize: number;
  roughness: number;
  seed?: number;
  _stroke: string;
  _strokeWidth: number;

  constructor(config: RoughArrowProps) {
    super(config);

    this.points = config.points || [0, 0, 0, 0];
    this.points = [];
    this.arrowSize = config.arrowSize || 15;
    this.roughness = config.roughness || 1;
    this.seed = config.seed || Math.random() * 1000;
    this._stroke = config.stroke as string || '#0000FF'; // _ is a convention to denote these are private vars don't change it when extending
    this._strokeWidth = config.strokeWidth || 2;

    const points = config.points || [0, 0, 0, 0];
    this.setPoints(points);
  }

  createArrow() {
    // Clear existing children
    this.destroyChildren();

    if (this.points.length < 4) return;

    // Use internal relative points
    const x1 = this.points[0];
    const y1 = this.points[1];
    const x2 = this.points[2];
    const y2 = this.points[3];

    if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) return;

    const generator = rough.generator();

    // Create line
    const lineShape = new Konva.Shape({
      hitStrokeWidth: 20,
      hitFunc: (context) => {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.fillStrokeShape(lineShape);
      },
      sceneFunc: (context) => {
        const lineDrawable = generator.line(x1, y1, x2, y2, {
          stroke: this._stroke,
          strokeWidth: this._strokeWidth,
          roughness: this.roughness,
          seed: this.seed,
        });

        drawRoughPath(context._context, lineDrawable);
      },
    });

    // Calculate arrow angle
    // Arrow logic using relative points works same as absolute as long as dX, dY are same.
    const angle = Math.atan2(y2 - y1, x2 - x1);

    // Calculate arrowhead points
    const arrowLength = this.arrowSize;
    // const arrowWidth = this.arrowSize * 0.6;

    // tip of the arrow x2,y2
    const arrowTipX = x2;
    const arrowTipY = y2;

    // rotating the axis by 30deg to right and 30deg left to draw the arrowhead.
    // offset = Math.PI / 6 (that’s 30deg)
    const arrowLeft = [
      arrowTipX - arrowLength * Math.cos(angle - Math.PI / 6),
      arrowTipY - arrowLength * Math.sin(angle - Math.PI / 6),
    ];

    const arrowRight = [
      arrowTipX - arrowLength * Math.cos(angle + Math.PI / 6),
      arrowTipY - arrowLength * Math.sin(angle + Math.PI / 6),
    ];

    // if(!arrowLeft || !arrowRight) return;

    const al0 = arrowLeft[0] as number;
    const al1 = arrowLeft[1] as number;
    const ar0 = arrowRight[0] as number;
    const ar1 = arrowRight[1] as number;

    // Create arrowhead
    const arrowheadShape = new Konva.Shape({
      hitStrokeWidth: 20,
      hitFunc: (context) => {
        context.beginPath();
        context.moveTo(al0, al1);
        context.lineTo(arrowTipX, arrowTipY);
        context.lineTo(ar0, ar1);
        context.closePath();
        context.fillStrokeShape(arrowheadShape);
      },
      sceneFunc: (context) => {
        const arrowPoints: [number, number][] = [
          [al0, al1],
          [arrowTipX, arrowTipY],
          [ar0, ar1],
        ];

        const arrowDrawable = generator.polygon(arrowPoints, {
          stroke: this._stroke,
          strokeWidth: this._strokeWidth,
          roughness: this.roughness,
          seed: this.seed,
          fill: this._stroke,
          fillStyle: 'solid',
        });

        drawRoughPath(context._context, arrowDrawable);
      },
    });

    // add these to the grp
    this.add(lineShape);
    this.add(arrowheadShape);
  }

  setPoints(points: number[]) {
    if (points.length < 4) {
      this.points = points;
      return;
    }

    const x1 = points[0] as number;
    const y1 = points[1] as number;
    const x2 = points[2] as number;
    const y2 = points[3] as number;

    // Normalize bounds
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

    this.createArrow();
  }

  getPoints() {
    // Return absolute points from relative
    return [
      (this.points[0] as number) + this.x(),
      (this.points[1] as number) + this.y(),
      (this.points[2] as number) + this.x(),
      (this.points[3] as number) + this.y()
    ];
  }

  // this function works as a setter and getter in the same time kudos to claude for creating this lmao....
  // returning the current instnce allows chaining like this arrow.stroke('red').strokeWidth(5);
  stroke(color?: string) {
    if (color !== undefined) {
      this._stroke = color;
      this.createArrow();
      return this;
    }
    return this._stroke;
  }

  // same for this as well nigga
  strokeWidth(width?: number) {
    if (width !== undefined) {
      this._strokeWidth = width;
      this.createArrow();
      return this;
    }
    return this._strokeWidth;
  }
}