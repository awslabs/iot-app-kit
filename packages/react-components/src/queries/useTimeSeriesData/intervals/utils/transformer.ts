import { isHistoricalViewport, parseDuration } from '@iot-app-kit/core';
import { Interval, Viewport, ViewportType } from '../../types';

export const getViewportType = (viewport: Viewport): ViewportType =>
  isHistoricalViewport(viewport) ? 'historical' : 'duration';

export class IntervalTransformer {
  #now: number;
  #viewportType: ViewportType;

  constructor({
    now = Date.now(),
    viewportType,
  }: {
    now?: number;
    viewportType: ViewportType;
  }) {
    this.#now = now;
    this.#viewportType = viewportType;
  }

  toInterval(viewport: Viewport, now?: number): Interval {
    if (isHistoricalViewport(viewport)) {
      return {
        start: viewport.start,
        end: viewport.end,
        group: viewport.refreshRate,
      };
    }

    const startOffset = viewport.startOffset ?? 0;

    const end = now ?? this.#now - startOffset;
    const start = end - parseDuration(viewport.duration);

    return {
      start: new Date(start),
      end: new Date(end),
      group: viewport.refreshRate,
    };
  }

  toViewport(interval: Interval): Viewport {
    if (this.#viewportType === 'historical') {
      return {
        start: interval.start,
        end: interval.end,
        refreshRate: interval.group,
      };
    }

    return {
      startOffset: this.#now - interval.end.getTime(),
      duration: interval.end.getTime() - interval.start.getTime(),
      refreshRate: interval.group,
    };
  }
}
