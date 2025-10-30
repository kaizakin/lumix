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
    this.arrowSize = config.arrowSize || 15;
    this.roughness = config.roughness || 1;
    this.seed = config.seed || Math.random() * 1000;
    this._stroke = config.stroke as string || '#0000FF'; // _ is a convention to denote these are private vars don't change it when extending
    this._strokeWidth = config.strokeWidth || 2;

    this.createArrow();
  }

  createArrow() {
    // Clear existing children
    this.destroyChildren();

    if (this.points.length < 4) return;

    const [x1, y1, x2, y2] = this.points;
    const generator = rough.generator();

    // Create line
    const lineShape = new Konva.Shape({
      sceneFunc: (context) => {
        const lineDrawable = generator.line(x1 as number, y1 as number, x2 as number, y2 as number, {
          stroke: this._stroke,
          strokeWidth: this._strokeWidth,
          roughness: this.roughness,
          seed: this.seed,
        });

        drawRoughPath(context._context, lineDrawable);
      },
    });

    // Calculate arrow angle
    if (!y1 || !y2 || !x2 || !x1) return;
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

    // Create arrowhead
    const arrowheadShape = new Konva.Shape({
      sceneFunc: (context) => {
        const arrowPoints: [number, number][] = [
          [arrowLeft[0] as number, arrowLeft[1] as number],
          [arrowTipX, arrowTipY],
          [arrowRight[0] as number, arrowRight[1] as number],
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

  setPoints(points: number[]) {// updates points and redraws
    this.points = points;
    this.createArrow();
  }

  getPoints() {
    return this.points;
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