import {
  DataZoomComponentOption,
  ToolboxComponentOption,
  XAXisComponentOption,
} from 'echarts';

export const ECHARTS_GESTURE = 'echarts-gesture';

export const DEFAULT_DATA_ZOOM: DataZoomComponentOption = {
  type: 'inside',
  filterMode: 'filter',
  zoomOnMouseWheel: true,
  moveOnMouseMove: 'shift',
  moveOnMouseWheel: false,
};

export const DEFAULT_DATA_ZOOM_GESTURES_ENABLED: DataZoomComponentOption = {
  disabled: false,
};

export const DEFAULT_DATA_ZOOM_GESTURES_DISABLED: DataZoomComponentOption = {
  disabled: true,
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
  },
  axisTick: {
    show: false,
    length: 0,
  },
  minorTick: {
    show: false,
  },
  axisLine: {
    lineStyle: {
      width: 1,
    },
  },
  splitLine: {
    show: false,
  },
  nameLocation: 'middle',
  nameTextStyle: {
    fontWeight: 'bold',
    padding: [24, 0, 0, 0],
  },
  // hardcoding the x axis so that all viewport logic is managed exclusively by useDataZoom hooks
  min: 0,
  max: 4102513200000, // Jan 01 2100 19:00:00 UTC
};

export const DEFAULT_TOOLBOX_GESTURES_ENABLED: ToolboxComponentOption = {
  show: true,
  top: 4,
  right: 8,
  feature: {
    dataZoom: {
      title: { back: 'Undo\nzoom' },
      filterMode: 'none',
      yAxisIndex: 'none',
    },
  },
};

export const DEFAULT_TOOLBOX_GESTURES_DISABLED: ToolboxComponentOption = {
  show: false,
};
