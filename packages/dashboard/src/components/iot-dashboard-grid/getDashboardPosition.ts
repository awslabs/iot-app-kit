import { Position } from '../../types';

export const DASHBOARD_CONTAINER_ID = 'container';

export const getDashboardPosition = (event: MouseEvent): Position => {
  let totalOffsetX = event.offsetX;
  let totalOffsetY = event.offsetY;
  let currElement: HTMLElement | null = event.target as HTMLElement;

  while (currElement && currElement.id != DASHBOARD_CONTAINER_ID) {
    totalOffsetX += currElement.offsetLeft;
    totalOffsetY += currElement.offsetTop;
    currElement = (currElement as HTMLElement).offsetParent as HTMLElement;
  }

  return { x: totalOffsetX, y: totalOffsetY };
};
