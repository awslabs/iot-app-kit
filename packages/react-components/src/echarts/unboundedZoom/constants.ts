import { DataZoomComponentOption, XAXisComponentOption } from 'echarts';

export const ECHARTS_GESTURE = 'echarts-gesture';

export const DEFAULT_DATA_ZOOM: DataZoomComponentOption = {
  type: 'inside',
  filterMode: 'filter',
  zoomOnMouseWheel: true,
  moveOnMouseMove: 'shift',
  moveOnMouseWheel: false,
};

// this is the chart live mode refresh rate, this should be inline with the animation props
// https://echarts.apache.org/en/option.html#animation
export const LIVE_MODE_REFRESH_RATE_MS = 1000;

export const DEFAULT_X_AXIS: XAXisComponentOption = {
  id: 'default_x_axis_id',
  show: true,
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
