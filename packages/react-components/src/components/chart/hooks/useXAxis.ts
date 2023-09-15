import { ChartAxisOptions, ViewportInMs } from '../types';
import { DEFAULT_X_AXIS, DEFAULT_X_AXIS_ID } from '../eChartsConstants';
import { XAXisOption } from 'echarts/types/dist/shared';
import { useMemo } from 'react';

export const useXAxis = (viewportInMs: ViewportInMs, axis?: ChartAxisOptions): XAXisOption => {
  return useMemo(
    () => ({
      id: DEFAULT_X_AXIS_ID,
      show: axis?.showX ?? DEFAULT_X_AXIS.show,
      type: 'time' as const,
      axisLabel: {
        hideOverlap: true,
      },
      splitNumber: 6,
      min: 0,
      max: Date.now(),
    }),
    [viewportInMs]
  );
};
