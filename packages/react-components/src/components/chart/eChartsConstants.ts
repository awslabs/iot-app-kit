import type {
  DataZoomComponentOption,
  LegendComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
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

export const DEFAULT_X_AXIS: XAXisComponentOption = {
  show: true,
  type: 'time',
  splitNumber: 5,
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
};

export const DEFAULT_DATA_ZOOM: DataZoomComponentOption = {
  type: 'inside',
  filterMode: 'none',
  zoomOnMouseWheel: true,
  moveOnMouseMove: 'shift',
  moveOnMouseWheel: false,
};

export const DEFAULT_X_AXIS_ID = 'default-x-Axis';

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

// Zoom constants

export const ECHARTS_ZOOM_DEBOUNCE_MS = 300;

// legend constants
export const LEGEND_NAME_MIN_WIDTH_FACTOR = 3.5;

export const PERFORMANCE_MODE_THRESHOLD = 4000;
