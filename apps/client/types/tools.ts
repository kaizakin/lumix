export enum ToolType {
  SELECTION = 'selection',
  RECTANGLE = 'rectangle',
  ELLIPSE = 'ellipse',
  DIAMOND = 'diamond',
  ARROW = 'arrow',
  LINE = 'line',
  PENCIL = 'pencil',
  TEXT = 'text',
  ERASER = 'eraser'
}

export interface Tool {
  type: ToolType;
  icon: string;
  label: string;
}