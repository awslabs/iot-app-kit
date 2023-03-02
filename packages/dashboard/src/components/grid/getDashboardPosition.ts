import React from 'react';
import { Position } from '~/types';

export const DASHBOARD_CONTAINER_ID = 'container';

const getOffsets = (
  event: React.MouseEvent | React.TouchEvent | React.PointerEvent | MouseEvent | TouchEvent | PointerEvent
) => {
  if ((window.TouchEvent && event instanceof TouchEvent) || (event as React.TouchEvent).touches) {
    const ev = (event as TouchEvent).touches[0];

    const rect = (ev.target as HTMLElement).getBoundingClientRect();
    const offsetX = ev.clientX - rect.x;
    const offsetY = ev.clientY - rect.y;

    return {
      offsetX,
      offsetY,
    };
  }

  const ev = event as MouseEvent;
  const rect = (ev.target as HTMLElement).getBoundingClientRect();
  const offsetX = ev.clientX - rect.x;
  const offsetY = ev.clientY - rect.y;

  return {
    offsetX,
    offsetY,
  };
};

export const getDashboardPosition = (
  event: React.MouseEvent | React.TouchEvent | React.PointerEvent | MouseEvent | TouchEvent | PointerEvent
): Position => {
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
