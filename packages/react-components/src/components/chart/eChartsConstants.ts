import type {
  DataZoomComponentOption,
  LegendComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
  EChartsOption,
} from 'echarts';

export const DEFAULT_TOOLBOX_CONFIG: ToolboxComponentOption = {
  show: true,
  right: 30,
  feature: {
    dataZoom: { yAxisIndex: false, title: { back: 'Undo\nzoom' } },
  },
  iconStyle: {
    borderColor: '#414d5c',
  },
};

export const DEFAULT_Y_AXIS: YAXisComponentOption = {
  show: true,
  type: 'value',
  position: 'left',
};

// if you change this, please update the width calculation
export const DEFAULT_MARGIN = 50;

export const DEFAULT_LEGEND: LegendComponentOption = {
  show: true,
  type: 'scroll',
  orient: 'horizontal',
  left: 'left',
  bottom: '0',
  padding: [5, DEFAULT_MARGIN / 2],
};

export const DEFAULT_GRID = {
  left: DEFAULT_MARGIN,
  top: DEFAULT_MARGIN,
  right: DEFAULT_MARGIN,
  bottom: DEFAULT_MARGIN,
  containLabel: false,
} as const;

export const DEFAULT_TOOLTIP: TooltipComponentOption = {
  trigger: 'axis',
  confine: true,
};

export const DEFAULT_DATA_ZOOM: DataZoomComponentOption = {
  type: 'inside',
  filterMode: 'none',
  zoomOnMouseWheel: true,
  moveOnMouseMove: 'shift',
  moveOnMouseWheel: false,
};

export const DEFAULT_X_AXIS_ID = 'default-x-Axis';
export const DEFAULT_X_AXIS: XAXisComponentOption = {
  id: DEFAULT_X_AXIS_ID,
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

export const DEFAULT_CHART_VISUALIZATION = 'line' as const;
// this is the chart live mode refresh rate, this should be inline with the animation props
// https://echarts.apache.org/en/option.html#animation
// packages/react-components/src/components/chart/converters , line 30
export const LIVE_MODE_REFRESH_RATE_MS = 1000;

export const DEFAULT_PRECISION = 4;

// resize constants
export const CHART_RESIZE_INITIAL_FACTOR = 0.7;
export const CHART_RESIZE_MIN_FACTOR = 0.3;

// this is an arbitrary value, so that user can almost "close" the legend section if they want to
export const CHART_RESIZE_MAX_FACTOR = 0.85;

export const MULTI_Y_AXIS_LEGEND_WIDTH = 170;

// style constants
export const EMPHASIZE_SCALE_CONSTANT = 2;
export const DEEMPHASIZE_OPACITY = 0.25;

/**
 * Echarts tooltip has z-index of 9999999.
 * Must set context menu above this so its always displayed on top.
 */
export const CONTEXT_MENU_Z_INDEX = 10000000;

// Zoom constants

export const ECHARTS_ZOOM_DEBOUNCE_MS = 300;

// legend constants
export const LEGEND_NAME_MIN_WIDTH_FACTOR = 3.5;

export const PERFORMANCE_MODE_THRESHOLD = 4000;

export const DEFAULT_CHART_OPTION: EChartsOption = {
  aria: {
    enabled: true,
  },
  title: {
    top: 10,
  },
  dataZoom: DEFAULT_DATA_ZOOM,
  animation: false,
  toolbox: DEFAULT_TOOLBOX_CONFIG,
  xAxis: DEFAULT_X_AXIS,
  yAxis: [DEFAULT_Y_AXIS],
  grid: DEFAULT_GRID,
  tooltip: DEFAULT_TOOLTIP,
};
