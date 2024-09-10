import {
  Viewport,
  viewportEndDate,
  viewportStartDate,
} from '@iot-app-kit/core';
import { useMemo } from 'react';

/**
 *
 * Normalize optional refreshRate to a number.
 * If a refreshRate is specified directly,
 * that rate will be used. Otherwise, a refreshRate
 * will be calculated based on a fraction of viewport.
 * If no vewiport is specfied either, the refreshRate is
 * assumed to be Infinity.
 *
 * @param refreshRate passed in refreshRate in ms
 * @param viewport passed in viewport
 * @param minimumRefreshRate smallest amount the refreshRate
 * can be when calculating based on the viewport
 * - default: 5000ms
 * @param viewportRatePercentage the percentage of the viewport
 * to use as the refreshRate
 * - default: .5
 *
 * @returns a refreshRate in ms
 */
export const useRefreshRate = ({
  refreshRate,
  viewport,
  minimumRefreshRate = 5000,
  viewportRatePercentage = 0.5,
}: {
  refreshRate?: number;
  viewport?: Viewport;
  minimumRefreshRate?: number;
  viewportRatePercentage?: number;
}) => {
  return useMemo(() => {
    if (refreshRate != null) {
      return refreshRate;
    }

    if (viewport != null) {
      const startDate = viewportStartDate(viewport);
      const endDate = viewportEndDate(viewport);

      const viewportPercentageRate =
        (endDate.getTime() - startDate.getTime()) * viewportRatePercentage;

      return Math.max(viewportPercentageRate, minimumRefreshRate);
    }

    return Infinity;
  }, [refreshRate, viewport, minimumRefreshRate, viewportRatePercentage]);
};
