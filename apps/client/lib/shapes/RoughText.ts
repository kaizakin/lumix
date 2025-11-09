import Konva from 'konva';
import { RoughShapeProps } from '@/types/shapes';

interface RoughTextProps extends RoughShapeProps {
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
}

 // RoughText - Simple text rendering
 // Rough.js doesn't support text so use Konva.Text directly

export class RoughText extends Konva.Text {
  roughness: number;
  seed?: number;

  constructor(config: RoughTextProps) {
    super({
      ...config,
      text: config.text || '',
      fontSize: config.fontSize || 20,
      fontFamily: config.fontFamily || 'Virgil, sans-serif',
      fill: config.fill || '#000000',
      // Make text look more hand-drawn
      shadowblur: 2,
      lineHeight: 1.5,
      verticalAlign: 'top',
      shadowoffset: { x: 0, y: 0 },
      visible: false
    });

    this.roughness = config.roughness || 1;
    this.seed = config.seed || Math.random() * 1000;

    // Make text editable
    this.listening(true);
    console.log('RoughText created at:', this.x(), this.y(), 'visible:', this.visible());
  }

  // Update text content
  updateText(newText: string) {
    this.text(newText);
  }
}