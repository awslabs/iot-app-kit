import {
  type DurationViewport,
  type HistoricalViewport,
} from '@iot-app-kit/core';
import { type UseQueryOptions } from '@tanstack/react-query';

export type QueryOptionsGlobal = Pick<UseQueryOptions, 'retry'>;

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
