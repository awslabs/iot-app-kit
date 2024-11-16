import { useEffect, useState } from 'react';
import {
  type HistoricalViewport,
  type Viewport,
  isHistoricalViewport,
  isDurationViewport,
  viewportEndDate,
  viewportStartDate,
  parseDuration,
  type DurationViewport,
} from '@iot-app-kit/core';
import { DEFAULT_ANOMALY_DATA_SOURCE_VIEWPORT } from './constants';

const getDurationViewportRefreshRate = (
  viewport: DurationViewport,
  minimumRate = 1000
) => {
  const durationPercentage = parseDuration(viewport.duration) * 0.1;

  return Math.max(durationPercentage, minimumRate);
};

const asHistorical = (viewport: Viewport): HistoricalViewport => ({
  start: viewportStartDate(viewport),
  end: viewportEndDate(viewport),
});

/**
 * Controls the time window used to fetch anomaly events
 * The window is defined by a historical viewport (start, end)
 *
 * If the viewport is a duration viewport, the window will be updated on
 * an interval. The interval at which it updates can be defined by
 * the liveModeRefreshRate. Otherwise the refresh rate will be chosen
 * based off the duration.
 */
export const useAnomalyEventsViewport = ({
  viewport: passedInViewport,
  liveModeRefreshRate,
}: {
  viewport?: Viewport;
  liveModeRefreshRate?: number;
}) => {
  const viewport = passedInViewport ?? DEFAULT_ANOMALY_DATA_SOURCE_VIEWPORT;
  const { start: initialStart, end: initialEnd } = asHistorical(viewport);
  const [startDate, setStartDate] = useState<Date>(initialStart);
  const [endDate, setEndDate] = useState<Date>(initialEnd);

  /**
   * Handle a duration viewport
   *
   * Immediately set the time window so that the
   * viewport shows the start as now and the end
   * as now - duration
   *
   * choose an interval to update the window on and
   * periodically update the window on that interval
   */
  useEffect(() => {
    if (!isDurationViewport(viewport)) return;

    // Immediately change the start / end
    setStartDate(viewportStartDate(viewport));
    setEndDate(viewportEndDate(viewport));

    const refreshRate =
      liveModeRefreshRate ?? getDurationViewportRefreshRate(viewport);

    const interval = setInterval(() => {
      setStartDate(viewportStartDate(viewport));
      setEndDate(viewportEndDate(viewport));
    }, refreshRate);

    return () => {
      clearInterval(interval);
    };
  }, [liveModeRefreshRate, viewport]);

  useEffect(() => {
    if (!isHistoricalViewport(viewport)) return;
    setStartDate(new Date(viewport.start.getTime()));
    setEndDate(new Date(viewport.end.getTime()));
  }, [viewport]);

  return {
    start: startDate,
    end: endDate,
  };
};
