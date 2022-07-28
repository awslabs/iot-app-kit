import { Widget } from '../../types';

export const trimWidgetPosition = (widget: Widget): Widget => {
  widget.x = Math.round(widget.x);
  widget.y = Math.round(widget.y);
  widget.width = Math.round(widget.width);
  widget.height = Math.round(widget.height);
  return widget;
};
