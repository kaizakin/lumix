'use client';

import { useRef, useEffect, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage, Layer, Circle } from 'react-konva';
import Konva from 'konva';
import { useCanvas } from '@/hooks/useCanvas';
import { Toolbar } from './ToolBar';
import { ToolType } from '@/types/tools';
import { RoughRectangle } from '@/lib/shapes/RoughRectangle';
import { RoughEllipse } from '@/lib/shapes/RoughEllipse';
import { RoughDiamond } from '@/lib/shapes/RoughDiamond';
import { RoughLine } from '@/lib/shapes/RoughLine';
import { RoughArrow } from '@/lib/shapes/RoughArrow';
import { RoughPencil } from '@/lib/shapes/RoughPencil';
import { RoughText } from '@/lib/shapes/RoughText';
import { ERASER_CONFIG } from '@/utils/constants';
type RoughShape = RoughRectangle | RoughEllipse | RoughDiamond | RoughArrow | RoughLine | RoughPencil | RoughText | null;

export function Canvas() {
  const {
    tool,
    setTool,
    isDrawing,
    setIsDrawing,
    strokeColor,
    strokeWidth,
    roughness,
  } = useCanvas();

  const [stageSize, setStageSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });
  const [isMounted, setIsMounted] = useState(false);
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const currentShapeRef = useRef<RoughShape>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const [isEditingText, setIsEditingText] = useState(false);
  const isTextReadyRef = useRef(false);
  const [fontSize,] = useState(17);
  const [eraserCursor, setEraserCursor] = useState({ x: 0, y: 0, visible: false });
  const [isErasing, setIsErasing] = useState(false);
  const erasedShapesRef = useRef<Set<string>>(new Set()); // Track erased shapes in current stroke


  useEffect(() => {
    if (isEditingText && textInputRef.current) {
      isTextReadyRef.current = false;
      setTimeout(() => {
        textInputRef.current?.focus();
        isTextReadyRef.current = true;
      }, 10);// wait for react to render the textarea or else get stuck in race condition.
    }
  }, [isEditingText]);


  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!stageRef.current) return;

    const container = stageRef.current.container();

    if (tool === ToolType.ERASER) {
      container.style.cursor = 'none'; // none for now, will create custom cursor.
    } else if (tool === ToolType.PENCIL) {
      container.style.cursor = 'crosshair';
    } else if (tool === ToolType.TEXT) {
      container.style.cursor = 'text';
    } else {
      container.style.cursor = 'default';
    }
  }, [tool]);


  const getShapeAtPoint = (x: number, y: number): Konva.Shape | Konva.Group | null => {
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

      // Get the shape's bounding box
      const box = shape.getClientRect();

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
  const isPointNearPath = (
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


  const eraseShapeAtPoint = (x: number, y: number) => {
    const shape = getShapeAtPoint(x, y);

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

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (isEditingText) {
      console.log('Ignoring mouse down - editing text');
      return;
    }

    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (tool === ToolType.ERASER) {
      console.log('Eraser mouse down');
      setIsErasing(true);
      erasedShapesRef.current.clear(); // Reset already erased shapes in prev stroke.
      eraseShapeAtPoint(pos.x, pos.y);
      return;
    }

    if (tool === ToolType.SELECTION) return; // don't draw anything for a select tool dumbass.


    startPosRef.current.x = pos.x;
    startPosRef.current.y = pos?.y;
    setIsDrawing(true);

    const id = `shape-${Date.now()}`;

    // Create temporary shape based on tool
    let shape;
    switch (tool) {
      case ToolType.RECTANGLE:
        shape = new RoughRectangle({
          id,
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          stroke: strokeColor,
          strokeWidth,
          roughness,
        });
        break;
      case ToolType.ELLIPSE:
        shape = new RoughEllipse({
          id,
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          stroke: strokeColor,
          strokeWidth,
          roughness,
        });
        break;
      case ToolType.DIAMOND:
        shape = new RoughDiamond({
          id,
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          stroke: strokeColor,
          strokeWidth,
          roughness,
        });
        break;
      // line Uses points array instead of width/height
      case ToolType.LINE:
        shape = new RoughLine({
          id,
          x: 0,              // Lines don't use x,y position
          y: 0,
          points: [pos.x, pos.y, pos.x, pos.y],  // [x1, y1, x2, y2]
          stroke: strokeColor,
          strokeWidth,
          roughness,
        });
        break;

      // arrow uses points array + arrowhead
      case ToolType.ARROW:
        shape = new RoughArrow({
          id,
          x: 0,              // Arrows don't use x,y position
          y: 0,
          points: [pos.x, pos.y, pos.x, pos.y],  // [x1, y1, x2, y2] initially starting and ending points are same / update endpoint later.
          stroke: strokeColor,
          strokeWidth,
          roughness,
          arrowSize: 15,     // Size of the arrowhead
        });
        break;

      case ToolType.PENCIL:
        shape = new RoughPencil({
          id,
          x: 0,
          y: 0,
          points: [pos.x, pos.y],  // Start with first point
          stroke: strokeColor,
          strokeWidth,
          roughness,
        });
        break;

      case ToolType.TEXT: {// put braces coz initilazing a variable inside case has the same scope as switch put 
        // braces to avoid potential naming conflicts.
        console.log('Creating text at position:', pos);

        const adjustedY = pos.y - 40;// there is a difference between the textarea and konva text rendering baseline 
        // Textarea: Text starts from the top of the element (with some internal padding)
        // Konva.Text: By default, text is positioned by its baseline (the line where letters sit), not the top
        // this -40 is hardcoded and trial and error by me i don't think this is a proper solution but it works. 

        shape = new RoughText({
          id,
          x: pos.x,
          y: adjustedY,
          text: '',
          fontSize: fontSize,
          fontFamily: 'Virgil, sans-serif',
          fill: strokeColor,
        });

        // Store position for textarea
        setTextPosition({ x: pos.x, y: pos.y });
        setIsEditingText(true);
        setIsDrawing(false);

        console.log('Text shape created, editing mode activated');
        break;
      }
      default:
        return;
    }

    // put the shape just created in the stage.
    if (shape && layerRef.current) {
      layerRef.current.add(shape);
      currentShapeRef.current = shape;

      // Only draw if not text (text will be drawn after input)
      if (tool !== ToolType.TEXT) {
        layerRef.current.batchDraw();
      }
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {

    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (tool === ToolType.ERASER) {
      setEraserCursor({ x: pos.x, y: pos.y, visible: true });

      // If erasing (mouse down), erase shapes under cursor
      if (isErasing) {
        eraseShapeAtPoint(pos.x, pos.y);
      }
      return;
    }

    // Hide eraser cursor for other tools
    if (eraserCursor.visible) {
      setEraserCursor({ ...eraserCursor, visible: false });
    }


    if (!isDrawing || !currentShapeRef.current) return;

    // pencil: Add points continuously
    if (tool === ToolType.PENCIL && currentShapeRef.current instanceof RoughPencil) {
      currentShapeRef.current.addPoint(pos.x, pos.y);
      layerRef.current?.batchDraw();
    }
    // line & arrow: Update end point
    else if (tool === ToolType.LINE || tool === ToolType.ARROW) {
      const newPoints = [
        startPosRef.current.x,
        startPosRef.current.y,
        pos.x,
        pos.y,
      ];

      // Update the points - this triggers a redraw with new line position
      if (currentShapeRef.current instanceof RoughArrow || currentShapeRef.current instanceof RoughLine) { // update only if the currentshape in an instance of arrow or line coz others doesn't have the convept of points.
        currentShapeRef.current.setPoints(newPoints);
      }

      layerRef.current?.batchDraw();

    }
    // RECTANGLE/ELLIPSE/DIAMOND: Update dimensions
    else if (tool === ToolType.RECTANGLE ||
      tool === ToolType.ELLIPSE ||
      tool === ToolType.DIAMOND) {
      const width = pos.x - startPosRef.current.x;
      const height = pos.y - startPosRef.current.y;

      // Update shape dimensions (absolute values)
      currentShapeRef.current.width(Math.abs(width));
      currentShapeRef.current.height(Math.abs(height));

      // Adjust position if dragging left or up (negative width/height)
      if (width < 0) {
        currentShapeRef.current.x(pos.x);
      }
      if (height < 0) {
        currentShapeRef.current.y(pos.y);
      }
    }

    layerRef.current?.batchDraw();// Redraw yourself, but do it efficiently, batching multiple updates together.
  };

  const handleMouseUp = () => {
    if (isErasing) {
      console.log('Eraser mouse up');
      setIsErasing(false);
      erasedShapesRef.current.clear();
      return;
    }

    if (!isDrawing || !currentShapeRef.current) return;

    if (tool === ToolType.PENCIL && currentShapeRef.current instanceof RoughPencil) {
      currentShapeRef.current.smoothPath();
      layerRef.current?.batchDraw();
    }

    setIsDrawing(false);

    // Don't clear currentShapeRef for text (need it for textarea)
    if (tool !== ToolType.TEXT) {
      currentShapeRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (isErasing) {
      setIsErasing(false);
      erasedShapesRef.current.clear();
    }

    // Hide eraser cursor
    setEraserCursor({ ...eraserCursor, visible: false });
  };

  const handleTextSubmit = (text: string) => {
    console.log('Text submit called with:', text);
    console.log('Current shape:', currentShapeRef.current);

    if (!isTextReadyRef.current) {
      console.log('Text input not ready yet, ignoring blur');
      return;
    }

    if (!currentShapeRef.current) {
      console.log('No current shape, closing text editor');
      setIsEditingText(false);
      return;
    }

    if (currentShapeRef.current instanceof RoughText) {
      if (text.trim()) {
        console.log('Updating text shape with:', text);
        currentShapeRef.current.text(text);
        currentShapeRef.current.visible(true);
        layerRef.current?.batchDraw();
        console.log('Text updated and drawn');
      } else {
        console.log('Empty text, destroying shape');
        currentShapeRef.current.destroy();
        layerRef.current?.batchDraw();
      }
    }

    setIsEditingText(false);
    currentShapeRef.current = null;
  };

  const autoGrow = () => { // adjust the size of the textarea as the mf types.
    const textarea = textInputRef.current;
    if (textarea) {
      textarea.style.width = 'auto';
      textarea.style.height = 'auto';
      textarea.style.width = textarea.scrollWidth + 'px';
      textarea.style.height = textarea.scrollHeight + 'px';
    };
  }

  // Don't render until mounted to avoid SSR issues
  if (!isMounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading canvas...</div>
      </div>
    );
  }

  return (
    <div className='text-foreground relative'>
      <Toolbar onToolChange={setTool} selectedTool={tool} />
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <Layer ref={layerRef} />
        <Layer ref={layerRef}>
          {/* Custom eraser cursor */}
          {eraserCursor.visible && tool === ToolType.ERASER && (
            <Circle
              name="eraserCursor"
              x={eraserCursor.x}
              y={eraserCursor.y}
              radius={ERASER_CONFIG.cursorSize}
              stroke="#FFFFFF"
              strokeWidth={1}
              listening={false}  // Don't interfere with mouse events
            />
          )}
        </Layer>
      </Stage>
      {isEditingText && (
        <textarea
          ref={textInputRef}
          onInput={autoGrow}
          autoFocus
          placeholder=""
          style={{
            position: 'absolute',
            left: `${textPosition.x}px`,
            top: `${textPosition.y}px`,
            fontSize: `${fontSize}px`,
            fontFamily: 'Virgil, sans-serif',
            border: 'none',
            padding: '0',
            margin: '0',
            background: 'none',
            outline: 'none',
            resize: 'none',
            overflow: 'hidden', // no scrollbars
            whiteSpace: 'pre', // keep text formatting
            zIndex: 1000,
            color: strokeColor,
            lineHeight: 1.5,
            width: 'auto',
            height: 'auto',
            transformOrigin: 'left top' // Ensures scaling/positioning happens from the top-left corner like the canvas coordinate system 
            // Canvas coordinates start at (0,0) = top-left.
            // DOM transforms by default start at center.
            // This line makes both behave the same — so your overlay textarea doesn’t drift or misalign when scaling/zooming.
          }}
          onMouseDown={(e) => {
            // Prevent event from bubbling to Stage it will steal focus from textarea.
            e.stopPropagation();
          }}
          onClick={(e) => {
            // Prevent event from bubbling to Stage
            e.stopPropagation();
          }}
          onBlur={(e) => {
            console.log('Textarea blur event');
            handleTextSubmit(e.target.value);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Escape') {
              console.log('Escape pressed');
              handleTextSubmit('');
            }
          }}
        />
      )}
    </div>
  );
}