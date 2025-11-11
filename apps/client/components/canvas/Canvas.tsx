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
import { ZOOM_CONFIG } from '@/utils/constants';
import { eraseShapeAtPoint } from '@/utils/canvashelpers/shapeHelpers';
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
  // Pan and Zoom state
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const lastPanPosRef = useRef({ x: 0, y: 0 });


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
    } else if (tool === ToolType.SELECTION || isPanning) {
      container.style.cursor = isPanning ? 'grabbing' : 'grab';
    } else {
      container.style.cursor = 'default';
    }
  }, [tool, isPanning]);

  // Zoom functions
  const handleZoomIn = () => {
    const newScale = Math.min(stageScale + ZOOM_CONFIG.step, ZOOM_CONFIG.max);
    zoomToCenter(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(stageScale - ZOOM_CONFIG.step, ZOOM_CONFIG.min);
    zoomToCenter(newScale);
  };

  const handleResetZoom = () => {
    setStageScale(1);
    setStagePos({ x: 0, y: 0 });
  };

  const zoomToCenter = (newScale: number) => {
    if (!stageRef.current) return;

    const stage = stageRef.current;
    const oldScale = stage.scaleX();

    // center of the stage.
    const center = {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };

    const mousePointTo = {
      x: (center.x - stage.x()) / oldScale, // how far the stage’s origin is from the screen center. Dividing by oldScale converts that screen distance into the stage’s coordinate space
      y: (center.y - stage.y()) / oldScale,
    };

    const newPos = { // We adjust the stage’s x and y to keep that same point under the center, even after zooming in or out.
      x: center.x - mousePointTo.x * newScale,
      y: center.y - mousePointTo.y * newScale,
    };

    // "If we zoom in, push the stage outward so the same center stays visible.
    // If we zoom out, pull it inward accordingly."
    setStageScale(newScale);
    setStagePos(newPos);
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // Determine zoom direction and amount
    let direction = e.evt.deltaY > 0 ? -1 : 1;

    // Check if it's a pinch gesture (trackpad)
    if (e.evt.ctrlKey) {
      direction = e.evt.deltaY > 0 ? -1 : 1;
    }

    const newScale = Math.min(
      Math.max(oldScale + direction * ZOOM_CONFIG.wheelStep * Math.abs(e.evt.deltaY), ZOOM_CONFIG.min),
      ZOOM_CONFIG.max
    );

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStageScale(newScale);
    setStagePos(newPos);
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

    // Middle mouse button or Space + left click for panning
    const isMiddleButton = e.evt.button === 1;
    const isSpacePan = e.evt.button === 0 && e.evt.shiftKey;

    if (isMiddleButton || isSpacePan || (tool === ToolType.SELECTION && e.evt.button === 0)) {
      setIsPanning(true);
      lastPanPosRef.current = { x: pos.x, y: pos.y };
      return;
    }

    if (tool === ToolType.ERASER) {
      console.log('Eraser mouse down');
      setIsErasing(true);
      erasedShapesRef.current.clear(); // Reset already erased shapes in prev stroke.
      // Transform eraser position to account for zoom/pan
      const transform = stage.getAbsoluteTransform().copy().invert();
      const adjustedPos = transform.point(pos);
      eraseShapeAtPoint(adjustedPos.x, adjustedPos.y, layerRef as React.RefObject<Konva.Layer>, erasedShapesRef);
      return;
    }

    if (tool === ToolType.SELECTION) return; // don't draw anything for a select tool dumbass.

    // Transform mouse position to canvas space (accounting for zoom/pan)
    const transform = stage.getAbsoluteTransform().copy().invert();
    const adjustedPos = transform.point(pos);


    startPosRef.current.x = adjustedPos.x;
    startPosRef.current.y = adjustedPos?.y;
    setIsDrawing(true);

    const id = `shape-${Date.now()}`;

    // Create temporary shape based on tool
    let shape;
    switch (tool) {
      case ToolType.RECTANGLE:
        shape = new RoughRectangle({
          id,
          x: adjustedPos.x,
          y: adjustedPos.y,
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
          x: adjustedPos.x,
          y: adjustedPos.y,
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
          x: adjustedPos.x,
          y: adjustedPos.y,
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
          points: [adjustedPos.x, adjustedPos.y, adjustedPos.x, adjustedPos.y],  // [x1, y1, x2, y2]
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
          points: [adjustedPos.x, adjustedPos.y, adjustedPos.x, adjustedPos.y],  // [x1, y1, x2, y2] initially starting and ending points are same / update endpoint later.
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
          points: [adjustedPos.x, adjustedPos.y],  // Start with first point
          stroke: strokeColor,
          strokeWidth,
          roughness,
        });
        break;

      case ToolType.TEXT: {// put braces coz initilazing a variable inside case has the same scope as switch put 
        // braces to avoid potential naming conflicts.
        console.log('Creating text at position:', pos);

        const adjustedY = adjustedPos.y - 40;// there is a difference between the textarea and konva text rendering baseline 
        // Textarea: Text starts from the top of the element (with some internal padding)
        // Konva.Text: By default, text is positioned by its baseline (the line where letters sit), not the top
        // this -40 is hardcoded and trial and error by me i don't think this is a proper solution but it works. 

        shape = new RoughText({
          id,
          x: adjustedPos.x,
          y: adjustedY,
          text: '',
          fontSize: fontSize,
          fontFamily: 'Virgil, sans-serif',
          fill: strokeColor,
        });

        // Store position for textarea
        setTextPosition({ x: adjustedPos.x, y: pos.y });
        setIsEditingText(true);
        setIsDrawing(false);
        // Convert canvas coordinates back to screen coordinates for textarea
        setTextPosition({ x: pos.x, y: pos.y });
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

    // Handle panning
    if (isPanning) {
      const dx = pos.x - lastPanPosRef.current.x;
      const dy = pos.y - lastPanPosRef.current.y;

      setStagePos({
        x: stagePos.x + dx,
        y: stagePos.y + dy,
      });

      lastPanPosRef.current = { x: pos.x, y: pos.y };
      return;
    }

    if (tool === ToolType.ERASER) {
      setEraserCursor({ x: pos.x, y: pos.y, visible: true });

      // If erasing (mouse down), erase shapes under cursor
      if (isErasing) {
        const transform = stage.getAbsoluteTransform().copy().invert();
        const adjustedPos = transform.point(pos);
        eraseShapeAtPoint(adjustedPos.x, adjustedPos.y, layerRef as React.RefObject<Konva.Layer>, erasedShapesRef);
      }
      return;
    }

    // Hide eraser cursor for other tools
    if (eraserCursor.visible) {
      setEraserCursor({ ...eraserCursor, visible: false });
    }


    if (!isDrawing || !currentShapeRef.current) return;

    // Transform mouse position to canvas space
    const transform = stage.getAbsoluteTransform().copy().invert();
    const adjustedPos = transform.point(pos);

    // pencil: Add points continuously
    if (tool === ToolType.PENCIL && currentShapeRef.current instanceof RoughPencil) {
      currentShapeRef.current.addPoint(adjustedPos.x, adjustedPos.y);
      layerRef.current?.batchDraw();
    }
    // line & arrow: Update end point
    else if (tool === ToolType.LINE || tool === ToolType.ARROW) {
      const newPoints = [
        startPosRef.current.x,
        startPosRef.current.y,
        adjustedPos.x,
        adjustedPos.y,
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
      const width = adjustedPos.x - startPosRef.current.x;
      const height = adjustedPos.y - startPosRef.current.y;

      // Update shape dimensions (absolute values)
      currentShapeRef.current.width(Math.abs(width));
      currentShapeRef.current.height(Math.abs(height));

      // Adjust position if dragging left or up (negative width/height)
      if (width < 0) {
        currentShapeRef.current.x(adjustedPos.x);
      }
      if (height < 0) {
        currentShapeRef.current.y(adjustedPos.y);
      }
    }

    layerRef.current?.batchDraw();// Redraw yourself, but do it efficiently, batching multiple updates together.
  };

  const handleMouseUp = () => {

    if (isPanning) {
      setIsPanning(false);
      return;
    }

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

    if (isPanning) {
      setIsPanning(false);
    }

    // Hide eraser cursor
    setEraserCursor({ ...eraserCursor, visible: false });
  };

  const handleTextSubmit = (text: string) => {

    if (!isTextReadyRef.current) {
      return;
    }

    if (!currentShapeRef.current) {
      setIsEditingText(false);
      return;
    }

    if (currentShapeRef.current instanceof RoughText) {
      if (text.trim()) {
        currentShapeRef.current.text(text);
        currentShapeRef.current.visible(true);
        layerRef.current?.batchDraw();
      } else {
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
      {/* Zoom Controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black border border-gray-300 rounded-lg shadow-lg px-3 py-2 z-50">
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom Out"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>

        <button
          onClick={handleResetZoom}
          className="px-3 py-1 hover:bg-gray-100 rounded transition-colors text-sm font-medium min-w-[60px]"
          title="Reset Zoom"
        >
          {Math.round(stageScale * 100)}%
        </button>

        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom In"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
      </div>
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        draggable={false}
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
            transformOrigin: 'left top', // Ensures scaling/positioning happens from the top-left corner like the canvas coordinate system 
            // Canvas coordinates start at (0,0) = top-left.
            // DOM transforms by default start at center.
            // This line makes both behave the same — so your overlay textarea doesn’t drift or misalign when scaling/zooming.
            transform: `scale(${stageScale})` // Scale textarea with canvas
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