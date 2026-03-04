import Konva from "konva";
import { RoughArrow } from "@/lib/shapes/RoughArrow";
import { RoughDiamond } from "@/lib/shapes/RoughDiamond";
import { RoughEllipse } from "@/lib/shapes/RoughEllipse";
import { RoughLine } from "@/lib/shapes/RoughLine";
import { RoughPencil } from "@/lib/shapes/RoughPencil";
import { RoughRectangle } from "@/lib/shapes/RoughRectangle";
import { RoughText } from "@/lib/shapes/RoughText";

export type CanvasShapeType =
  | "rectangle"
  | "ellipse"
  | "diamond"
  | "line"
  | "arrow"
  | "pen"
  | "text";

export type CanvasShapeSnapshot = {
  id: string;
  type: CanvasShapeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: number[];
  stroke?: string;
  strokeWidth?: number;
  roughness?: number;
  seed?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export function normalizeCanvasSnapshot(payload: unknown): CanvasShapeSnapshot[] {
  if (!Array.isArray(payload)) return [];

  const shapes: CanvasShapeSnapshot[] = [];
  for (const item of payload) {
    if (!item || typeof item !== "object") continue;
    const shape = item as Partial<CanvasShapeSnapshot>;
    if (
      typeof shape.id !== "string" ||
      typeof shape.type !== "string" ||
      !isFiniteNumber(shape.x) ||
      !isFiniteNumber(shape.y)
    ) {
      continue;
    }

    const normalized: CanvasShapeSnapshot = {
      id: shape.id,
      type: shape.type as CanvasShapeType,
      x: shape.x,
      y: shape.y,
    };

    if (isFiniteNumber(shape.width)) normalized.width = shape.width;
    if (isFiniteNumber(shape.height)) normalized.height = shape.height;
    if (Array.isArray(shape.points) && shape.points.every(isFiniteNumber)) {
      normalized.points = shape.points;
    }
    if (typeof shape.stroke === "string") normalized.stroke = shape.stroke;
    if (isFiniteNumber(shape.strokeWidth)) normalized.strokeWidth = shape.strokeWidth;
    if (isFiniteNumber(shape.roughness)) normalized.roughness = shape.roughness;
    if (isFiniteNumber(shape.seed)) normalized.seed = shape.seed;
    if (typeof shape.text === "string") normalized.text = shape.text;
    if (isFiniteNumber(shape.fontSize)) normalized.fontSize = shape.fontSize;
    if (typeof shape.fontFamily === "string") normalized.fontFamily = shape.fontFamily;
    if (typeof shape.fill === "string") normalized.fill = shape.fill;

    shapes.push(normalized);
  }

  return shapes;
}

export function serializeCanvasLayer(layer: Konva.Layer): CanvasShapeSnapshot[] {
  const nodes = layer.getChildren((node) => {
    return node.getClassName() !== "Transformer" && node.name() !== "eraserCursor";
  });

  const snapshot: CanvasShapeSnapshot[] = [];

  nodes.forEach((node) => {
    const common = {
      id: node.id(),
      x: node.x(),
      y: node.y(),
    };

    if (node instanceof RoughRectangle) {
      snapshot.push({
        ...common,
        type: "rectangle",
        width: node.width(),
        height: node.height(),
        stroke: node.stroke() as string,
        strokeWidth: node.strokeWidth(),
        roughness: node.roughness,
        seed: node.seed,
      });
      return;
    }

    if (node instanceof RoughEllipse) {
      snapshot.push({
        ...common,
        type: "ellipse",
        width: node.width(),
        height: node.height(),
        stroke: node.stroke() as string,
        strokeWidth: node.strokeWidth(),
        roughness: node.roughness,
        seed: node.seed,
      });
      return;
    }

    if (node instanceof RoughDiamond) {
      snapshot.push({
        ...common,
        type: "diamond",
        width: node.width(),
        height: node.height(),
        stroke: node.stroke() as string,
        strokeWidth: node.strokeWidth(),
        roughness: node.roughness,
        seed: node.seed,
      });
      return;
    }

    if (node instanceof RoughLine) {
      snapshot.push({
        ...common,
        type: "line",
        points: node.getEndPoints(),
        stroke: node.stroke() as string,
        strokeWidth: node.strokeWidth(),
        roughness: node.roughness,
        seed: node.seed,
      });
      return;
    }

    if (node instanceof RoughArrow) {
      snapshot.push({
        ...common,
        type: "arrow",
        points: node.getPoints(),
        stroke: node.stroke() as string,
        strokeWidth: node.strokeWidth() as number,
        roughness: node.roughness,
        seed: node.seed,
      });
      return;
    }

    if (node instanceof RoughPencil) {
      snapshot.push({
        ...common,
        type: "pen",
        points: node.getPoints(),
        stroke: node.stroke() as string,
        strokeWidth: node.strokeWidth(),
        roughness: node.roughness,
        seed: node.seed,
      });
      return;
    }

    if (node instanceof RoughText) {
      snapshot.push({
        ...common,
        type: "text",
        text: node.text(),
        fontSize: node.fontSize(),
        fontFamily: node.fontFamily(),
        fill: node.fill() as string,
        roughness: node.roughness,
        seed: node.seed,
      });
    }
  });

  return snapshot;
}

function createNodeFromSnapshot(shape: CanvasShapeSnapshot): Konva.Shape | Konva.Group | null {
  const common = {
    id: shape.id,
    x: shape.x,
    y: shape.y,
    stroke: shape.stroke ?? "#000000",
    strokeWidth: shape.strokeWidth ?? 2,
    roughness: shape.roughness ?? 1.2,
    seed: shape.seed,
  };

  switch (shape.type) {
    case "rectangle":
      return new RoughRectangle({
        ...common,
        width: shape.width ?? 0,
        height: shape.height ?? 0,
      });
    case "ellipse":
      return new RoughEllipse({
        ...common,
        width: shape.width ?? 0,
        height: shape.height ?? 0,
      });
    case "diamond":
      return new RoughDiamond({
        ...common,
        width: shape.width ?? 0,
        height: shape.height ?? 0,
      });
    case "line":
      return new RoughLine({
        ...common,
        points: shape.points ?? [shape.x, shape.y, shape.x, shape.y],
      });
    case "arrow":
      return new RoughArrow({
        ...common,
        points: shape.points ?? [shape.x, shape.y, shape.x, shape.y],
      });
    case "pen":
      return new RoughPencil({
        ...common,
        points: shape.points ?? [shape.x, shape.y],
      });
    case "text":
      return new RoughText({
        id: shape.id,
        x: shape.x,
        y: shape.y,
        text: shape.text ?? "",
        fontSize: shape.fontSize ?? 17,
        fontFamily: shape.fontFamily ?? "Virgil, sans-serif",
        fill: shape.fill ?? "#000000",
        roughness: shape.roughness ?? 1.2,
        seed: shape.seed,
      });
    default:
      return null;
  }
}

export function applyCanvasSnapshot(layer: Konva.Layer, snapshot: CanvasShapeSnapshot[]): void {
  const existing = layer.getChildren((node) => {
    return node.getClassName() !== "Transformer" && node.name() !== "eraserCursor";
  });
  existing.forEach((node) => node.destroy());

  snapshot.forEach((shape) => {
    const node = createNodeFromSnapshot(shape);
    if (!node) return;
    layer.add(node);
  });

  layer.batchDraw();
}
