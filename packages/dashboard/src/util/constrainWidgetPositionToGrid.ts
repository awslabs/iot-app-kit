import { Rect, AnyWidget } from '~/types';

export const constrainWidgetPositionToGrid = (gridRect: Rect, widget: AnyWidget): AnyWidget => ({
  ...widget,
  x: Math.min(gridRect.width - widget.width, Math.max(gridRect.x, widget.x)),
  y: Math.min(gridRect.height - widget.height, Math.max(gridRect.y, widget.y)),
});
