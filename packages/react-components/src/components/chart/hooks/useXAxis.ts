import { ChartAxisOptions } from '../types';
import { DEFAULT_X_AXIS, DEFAULT_X_AXIS_ID } from '../eChartsConstants';
import { XAXisOption } from 'echarts/types/dist/shared';
import { useMemo } from 'react';

export const useXAxis = (axis?: ChartAxisOptions): XAXisOption => {
  return useMemo(
    () => ({
      id: DEFAULT_X_AXIS_ID,
      show: axis?.showX ?? DEFAULT_X_AXIS.show,
      type: 'time' as const,
      axisLabel: {
        hideOverlap: true,
        color: '#5f6b7a',
      },
      axisLine: {
        lineStyle: {
          color: '#e9ebed',
          width: 2,
        },
      },
      splitNumber: 6,
      min: 0,
      max: Date.now(),
    }),
    [axis?.showX]
  );
};
