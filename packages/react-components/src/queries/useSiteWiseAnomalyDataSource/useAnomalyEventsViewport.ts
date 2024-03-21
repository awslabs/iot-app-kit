import {
  HistoricalViewport,
  Viewport,
  isHistoricalViewport,
  isDurationViewport,
  viewportEndDate,
  viewportStartDate,
  parseDuration,
  DurationViewport,
} from '@iot-app-kit/core';
import { DEFAULT_ANOMALY_DATA_SOURCE_VIEWPORT } from './constants';
import { useEffect, useState } from 'react';

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

  /**
   * Update the start and end to be the largest observed window.
   * Start and end are used to get the property value history
   * for anomaly result properties. Because these are the raw values,
   * and there are no aggregation based on the selected viewport
   * we don't need to re-request data if we zoom in. The data
   * will be the same at any fidelity.
   *
   * The data will be re-requested after the stale time is complete.
   */
  useEffect(() => {
    if (!isHistoricalViewport(viewport)) return;

    const updatedStartDate = Math.min(
      viewport.start.getTime(),
      startDate.getTime()
    );
    if (startDate.getTime() !== updatedStartDate) {
      setStartDate(new Date(updatedStartDate));
    }

    const updatedEndDate = Math.max(viewport.end.getTime(), endDate.getTime());
    if (endDate.getTime() !== updatedEndDate) {
      setEndDate(new Date(updatedEndDate));
    }
  }, [viewport, startDate, endDate]);

  return {
    start: startDate,
    end: endDate,
  };
};
