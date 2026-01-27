import { RoughArrow } from "@/lib/shapes/RoughArrow";
import { RoughLine } from "@/lib/shapes/RoughLine";
import { RoughPencil } from "@/lib/shapes/RoughPencil";
import { ERASER_CONFIG } from "../constants";
import Konva from "konva";

export const getShapeAtPoint = (x: number, y: number, layerRef: React.RefObject<Konva.Layer>): Konva.Shape | Konva.Group | null => {
    if (!layerRef.current) return null;

    const shapes = layerRef.current.getChildren();

    // Check each shape in reverse order (top to bottom) coz last drawn shape will be at the top dumbass.
    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];

        if (!shape) continue;

        // Skip the eraser cursor circle
        if (shape.name() === 'eraserCursor') continue;

        // Special handling for point-based shapes (Line, Arrow, Pencil)
        if (shape instanceof RoughLine ||
            shape instanceof RoughArrow ||
            shape instanceof RoughPencil) {

            // Get points array
            let points: number[] = [];

            if (shape instanceof RoughArrow) {
                points = shape.getPoints();
            } else if (shape instanceof RoughLine) {
                points = shape.getEndPoints();
            } else if (shape instanceof RoughPencil) {
                points = shape.getPoints();
            }

            // Check if cursor is near any point in the line/path
            if (isPointNearPath(x, y, points, ERASER_CONFIG.hitRadius)) {
                console.log('Found point-based shape:', shape.constructor.name);
                return shape as Konva.Shape | Konva.Group;
            }

            continue; // Skip normal bounding box check for these shapes
        }

        // Get the shape's bounding box relative to the layer (world space)
        // We must cast layerRef.current to Konva.Layer because we checked it strictly at the top
        const box = shape.getClientRect({ relativeTo: layerRef.current as Konva.Layer });

        // Check if point is inside bounding box with some padding
        const padding = ERASER_CONFIG.hitRadius;
        if (
            x >= box.x - padding &&
            x <= box.x + box.width + padding &&
            y >= box.y - padding &&
            y <= box.y + box.height + padding
        ) {
            return shape as Konva.Shape | Konva.Group;
        }
    }

    return null;
};

// Helper function to check if point is near a path (line/pencil/arrow)
export const isPointNearPath = (
    x: number,
    y: number,
    points: number[],
    threshold: number
): boolean => {
    if (points.length < 4) return false; // Need at least 2 points (x1,y1,x2,y2)

    for (let i = 0; i < points.length - 2; i += 2) {
        const x1 = points[i];
        const y1 = points[i + 1];
        const x2 = points[i + 2];// this overlaps the last x2,y2 that is why +=2
        const y2 = points[i + 3];

        // Calculate distance from point to line segment
        const distance = distanceToLineSegment(x, y, x1 as number, y1 as number, x2 as number, y2 as number);

        if (distance <= threshold) {// threshold is the hit radius.
            return true; // Point is close enough to this segment
        }
    }

    return false;
};

// Calculate distance from point to line segment
// complex math mind goes brr ask claude if have any doubts.
const distanceToLineSegment = (
    px: number, py: number,  // Point to check
    x1: number, y1: number,  // Line start
    x2: number, y2: number   // Line end
): number => {
    // Vector from line start to end
    const dx = x2 - x1;
    const dy = y2 - y1;

    // If line is actually a point
    if (dx === 0 && dy === 0) {
        return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);// pythagorean theorem.
    }

    // Calculate the t parameter (projection of point onto line)
    let t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);

    // Clamp t to [0, 1] to stay within the line segment
    t = Math.max(0, Math.min(1, t));

    // Find the closest point on the line segment
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;

    // Return distance from point to closest point on segment
    return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
};



export const eraseShapeAtPoint = (x: number, y: number, layerRef: React.RefObject<Konva.Layer>, erasedShapesRef: React.RefObject<Set<string>>) => {
    const shape = getShapeAtPoint(x, y, layerRef);

    if (shape) {
        const shapeId = shape.id();

        // Prevent erasing same shape multiple times in one stroke
        if (erasedShapesRef.current.has(shapeId)) {
            return;
        }

        console.log('Erasing shape:', shapeId);

        // Add to erased set
        erasedShapesRef.current.add(shapeId);

        // Animate removal 
        const box = shape.getClientRect();

        // Set scaling origin to center
        /// by default origin is at the left top, set it to center to make the fade transition.
        shape.offsetX(box.width / 2);
        shape.offsetY(box.height / 2);
        shape.x(shape.x() + box.width / 2);
        shape.y(shape.y() + box.height / 2);

        /// it's the konva's built-in animation method here it animates shrinking and fading on eraasing a shape.
        shape.to({
            opacity: 0,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 0.05,
            onFinish: () => {
                shape.destroy();
                layerRef.current?.batchDraw();
            }
        });
    }
};
