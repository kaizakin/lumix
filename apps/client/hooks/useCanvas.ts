'use client';

import { useState } from 'react';
import { ToolType } from '@/types/tools';
import { ShapeConfig } from '@/types/shapes';
import { DEFAULT_SHAPE_CONFIG } from '@/utils/constants';

export function useCanvas() {
  const [tool, setTool] = useState(ToolType.SELECTION);
  const [shapes, setShapes] = useState<ShapeConfig[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState(DEFAULT_SHAPE_CONFIG.stroke);
  const [strokeWidth, setStrokeWidth] = useState(DEFAULT_SHAPE_CONFIG.strokeWidth);
  const [roughness, setRoughness] = useState(DEFAULT_SHAPE_CONFIG.roughness);

  const addShape = (shape: ShapeConfig) => {
    setShapes((prev) => [...prev, shape]);
  };

  const updateShape = (id: string, updates: Partial<ShapeConfig>) => {
    setShapes((prev) =>
      prev.map((shape) => (shape.id === id ? { ...shape, ...updates } : shape))
    );
  };

  const deleteShape = (id: string) => {
    setShapes((prev) => prev.filter((shape) => shape.id !== id));// filters out the given shape id
    if (selectedShapeId === id) { // also clears the selection if the deleted shape is selected.
      setSelectedShapeId(null);
    }
  };

  return {
    tool,
    setTool,
    shapes,
    addShape,
    updateShape,
    deleteShape,
    selectedShapeId,
    setSelectedShapeId,
    isDrawing,
    setIsDrawing,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    roughness,
    setRoughness,
  };
}