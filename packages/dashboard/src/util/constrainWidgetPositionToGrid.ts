import { Rect, Widget } from '~/types';

export const constrainWidgetPositionToGrid = (gridRect: Rect, widget: Widget): Widget => ({
  ...widget,
  x: Math.min(gridRect.width - widget.width, Math.max(gridRect.x, widget.x)),
  y: Math.min(gridRect.height - widget.height, Math.max(gridRect.y, widget.y)),
});
