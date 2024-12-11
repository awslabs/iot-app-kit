import type { DashboardWidget } from '#types';
import type { Rectangle } from './rectangle';

export function toRectangle(widget: DashboardWidget): Rectangle {
  return {
    min: {
      x: widget.x,
      y: widget.y,
    },
    max: {
      x: widget.x + widget.width,
      y: widget.y + widget.height,
    },
  };
}
