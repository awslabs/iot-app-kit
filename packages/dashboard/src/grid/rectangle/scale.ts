import { translate } from '#grid/rectangle/translate';
import { Rectangle } from '#grid/rectangle/types';
import type { DashboardWidget, Rectangle as OldRectangle } from '../../types';

export const transformWidget: (
  widget: DashboardWidget,
  pre: OldRectangle,
  curr: OldRectangle
) => DashboardWidget = (widget, prev, curr) => {
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

export function scaleWithContainer(
  rectangle: Rectangle,
  containerBefore: Rectangle,
  containerAfter: Rectangle
): Rectangle {
  const scaleX = scalingFactor(containerAfter.width, containerBefore.width);
  const scaleY = scalingFactor(containerAfter.height, containerBefore.height);
  const offSetX = scaleX * (rectangle.x - containerBefore.x);
  const offSetY = scaleY * (rectangle.y - containerBefore.y);

  let scaled = scale(rectangle, { x: scaleX, y: scaleY });
  scaled = translate(scaled, { x: offSetX, y: offSetY });

  return scaled;
}

export function scale(
  { width, height, ...rectangle }: Rectangle,
  scalingFactor: { x: number; y: number }
): Rectangle {
  return {
    ...rectangle,
    width: width * scalingFactor.x,
    height: height * scalingFactor.y,
  };
}

export function scalingFactor(scalarA: number, scalarB: number): number {
  return scalarA / scalarB;
}
