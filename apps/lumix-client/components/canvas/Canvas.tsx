'use client';

import { useRef, useEffect, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage, Layer } from 'react-konva';
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
  const stageRef = useRef(null);
  const layerRef = useRef<Konva.Layer>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  // const transformerRef = useRef(null);
  const currentShapeRef = useRef<RoughShape>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const [isEditingText, setIsEditingText] = useState(false);
  const isTextReadyRef = useRef(false);

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

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (isEditingText) {
      console.log('Ignoring mouse down - editing text');
      return;
    }

    if (tool === ToolType.SELECTION) return; // don't draw anything for a select tool dumbass.

    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

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

      case ToolType.TEXT:
        console.log('Creating text at position:', pos);

        shape = new RoughText({
          id,
          x: pos.x,
          y: pos.y,
          text: '',
          fontSize: 20,
          fontFamily: 'Virgil, sans-serif',
          fill: strokeColor,
        });

        // Store position for textarea
        setTextPosition({ x: pos.x, y: pos.y });
        setIsEditingText(true);
        setIsDrawing(false);

        console.log('Text shape created, editing mode activated');
        break;
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
    if (!isDrawing || !currentShapeRef.current) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    // PENCIL: Add points continuously
    if (tool === ToolType.PENCIL && currentShapeRef.current instanceof RoughPencil) {
      currentShapeRef.current.addPoint(pos.x, pos.y);
      layerRef.current?.batchDraw();
    }
    // LINE & ARROW: Update end point
    else if (tool === ToolType.LINE || tool === ToolType.ARROW) {
      const newPoints = [
        startPosRef.current.x,    // Start X
        startPosRef.current.y,    // Start Y
        pos.x,                     // End X (current mouse position)
        pos.y,                     // End Y (current mouse position)
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
      >
        <Layer ref={layerRef} />
      </Stage>
      {isEditingText && (
        <textarea
          ref={textInputRef}
          autoFocus
          placeholder="Type text here..."
          style={{
            position: 'absolute',
            left: `${textPosition.x}px`,
            top: `${textPosition.y}px`,
            fontSize: '20px',
            fontFamily: 'Virgil, sans-serif',
            border: '2px solid #4F46E5',
            borderRadius: '4px',
            padding: '8px',
            background: 'white',
            minWidth: '200px',
            minHeight: '20px',
            resize: 'both',
            outline: 'none',
            zIndex: 1000,
            color: strokeColor,
            lineHeight: '1.4',
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
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              console.log('Enter pressed');
              handleTextSubmit(e.currentTarget.value);
            }
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