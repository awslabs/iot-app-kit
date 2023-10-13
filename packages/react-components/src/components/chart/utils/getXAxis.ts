import { ChartAxisOptions } from '../types';
import { DEFAULT_X_AXIS, DEFAULT_X_AXIS_ID } from '../eChartsConstants';
import { XAXisOption } from 'echarts/types/dist/shared';

export const getXAxis = (axis?: ChartAxisOptions): XAXisOption => {
  return {
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
    // hardcoding the x axis so that all viewport logic is managed exclusively by useDataZoom hooks
    min: 0,
    max: 4102513200000, // Jan 01 2100 19:00:00 UTC
  };
};
