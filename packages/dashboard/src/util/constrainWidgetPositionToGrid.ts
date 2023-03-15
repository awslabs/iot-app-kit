import type { Rect, Widget } from '~/types';

const max = Math.max;
const min = Math.min;
export const constrainWidgetPositionToGrid = (gridRect: Rect, widget: Widget): Widget => ({
  ...widget,
  x: max(0, min(gridRect.width - widget.width, max(gridRect.x, widget.x))),
  y: max(0, min(gridRect.height - widget.height, max(gridRect.y, widget.y))),
  height: min(gridRect.height, max(widget.height, 0)),
  width: min(gridRect.width, max(widget.width, 0)),
});
