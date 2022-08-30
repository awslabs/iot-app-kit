import { Position } from '../../types';

export const DASHBOARD_CONTAINER_ID = 'container';

const getOffsets = (event: MouseEvent | TouchEvent | PointerEvent) => {
  if (event instanceof TouchEvent) {
    const ev = event.touches[0];

    const rect = (ev.target as HTMLElement).getBoundingClientRect();
    const offsetX = ev.clientX - rect.x;
    const offsetY = ev.clientY - rect.y;

    return {
      offsetX,
      offsetY,
    };
  }

  return {
    offsetX: event.offsetX,
    offsetY: event.offsetY,
  };
};

export const getDashboardPosition = (event: MouseEvent | TouchEvent | PointerEvent): Position => {
  const { offsetX, offsetY } = getOffsets(event);
  let totalOffsetX = offsetX;
  let totalOffsetY = offsetY;
  let currElement: HTMLElement | null = event.target as HTMLElement;

  while (currElement && currElement.id != DASHBOARD_CONTAINER_ID) {
    totalOffsetX += currElement.offsetLeft;
    totalOffsetY += currElement.offsetTop;
    currElement = (currElement as HTMLElement).offsetParent as HTMLElement;
  }

  return { x: totalOffsetX, y: totalOffsetY };
};
