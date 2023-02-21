import { AnyWidget } from '~/types';

export const trimWidgetPosition = (widget: AnyWidget): AnyWidget => {
  return {
    ...widget,
    x: Math.round(widget.x),
    y: Math.round(widget.y),
    width: Math.round(widget.width),
    height: Math.round(widget.height),
  };
};
