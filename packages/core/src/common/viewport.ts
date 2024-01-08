import { isHistoricalViewport } from './predicates';
import { parseDuration } from './time';
import type { Viewport } from '../data-module/data-cache/requestTypes';

export const viewportStartDate = (
  viewport: Viewport,
  currentDate?: Date
): Date =>
  isHistoricalViewport(viewport)
    ? new Date(viewport.start)
    : new Date(
        (currentDate?.getTime() || Date.now()) -
          parseDuration(viewport.duration)
      );

export const viewportEndDate = (
  viewport: Viewport,
  currentDate?: Date
): Date => {
  return isHistoricalViewport(viewport)
    ? new Date(viewport.end)
    : currentDate || new Date(Date.now());
};
