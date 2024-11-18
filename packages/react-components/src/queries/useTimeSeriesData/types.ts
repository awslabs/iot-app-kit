import {
  type DurationViewport,
  type HistoricalViewport,
} from '@iot-app-kit/core';

export type LiveDataConfiguration = {
  duration: number;
  refreshRate: number;
};

export type SeriaizedRequest = Record<
  string,
  string | number | Date | undefined | Array<string | number | Date | undefined>
>;

export type Interval = {
  start: Date;
  end: Date;
  /**
   * group is used to determine if 2 intervals can be
   * collapsed into 1 interval.
   *
   * Practically this means intervals with the same
   * refresh rate
   */
  group?: number;
};

export type Viewport = (
  | HistoricalViewport
  | (DurationViewport & { startOffset?: number })
) & { refreshRate?: number };

export type ViewportType = 'historical' | 'duration';
