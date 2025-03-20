import type { Rectangle } from '~/types';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export const transformWidget: <Widget extends WidgetInstance>(
  widget: Widget,
  pre: Rectangle,
  curr: Rectangle
) => Widget = (widget, prev, curr) => {
  const offsetX = widget.x - prev.x;
  const offsetY = widget.y - prev.y;

  const scaleX = curr.width / prev.width;
  const scaleY = curr.height / prev.height;

  return {
    ...widget,
    x: curr.x + offsetX * scaleX,
    y: curr.y + offsetY * scaleY,
    width: widget.width * scaleX,
    height: widget.height * scaleY,
  };
};
