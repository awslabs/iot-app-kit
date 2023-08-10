import { ChartAxisOptions, ViewportInMs } from '../types';
import { DEFAULT_X_AXIS } from '../eChartsConstants';
import { XAXisOption } from 'echarts/types/dist/shared';
import { useMemo } from 'react';

export const useXAxis = (viewportInMs: ViewportInMs, axis?: ChartAxisOptions): XAXisOption => {
  return useMemo(
    () => ({
      show: axis?.showX ?? DEFAULT_X_AXIS.show,
      type: 'time' as const,
      splitNumber: 6,
      min: viewportInMs.initial,
      max: viewportInMs.end,
    }),
    [viewportInMs]
  );
};
