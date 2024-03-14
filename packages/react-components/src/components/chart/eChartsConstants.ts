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
  right: 52,
  top: 6, // top 6 is to avoid the overalping of echart toolbox with widget toolbox
  feature: {
    dataZoom: { title: { back: 'Undo\nzoom' }, filterMode: 'none' },
  },
  iconStyle: {
    borderColor: '#414d5c',
  },
};

export const DEFAULT_Y_AXIS: YAXisComponentOption = {
  show: true,
  type: 'value',
  position: 'left',
  scale: true,
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
  filterMode: 'filter',
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

export const UNCERTAIN_DATA_ICON_COLOR = '#8D6605';
export const UNCERTAIN_DATA_ICON_SIZE = 20;
export const UNCERTAIN_DATA_ICON =
  'path://M13.9088 12.7337L7.78375 0.483688C7.46129 -0.161229 6.54096 -0.161229 6.2185 0.483688L0.0935051 12.7337C-0.197389 13.3155 0.22567 14 0.876129 14H13.1261C13.7766 14 14.1996 13.3155 13.9088 12.7337ZM2.29191 12.25L7.00113 2.83156L11.7103 12.25H2.29191ZM7.87613 9.625V11.375H6.12613V9.625H7.87613ZM6.12613 8.75V5.25H7.87613V8.75H6.12613Z';
export const BAD_DATA_ICON_COLOR = '#D91515';
export const BAD_DATA_ICON_SIZE = 20;
export const BAD_DATA_ICON =
  'path://M0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7ZM12.25 7C12.25 9.8995 9.8995 12.25 7 12.25C4.1005 12.25 1.75 9.8995 1.75 7C1.75 4.1005 4.1005 1.75 7 1.75C9.8995 1.75 12.25 4.1005 12.25 7ZM5.76256 7L3.90503 8.85753L5.14247 10.095L7 8.23744L8.85753 10.095L10.095 8.85753L8.23744 7L10.095 5.14247L8.85753 3.90503L7 5.76256L5.14247 3.90503L3.90503 5.14247L5.76256 7Z';

/**
 * Echarts tooltip has z-index of 9999999.
 * Must set context menu above this so its always displayed on top.
 */
export const CONTEXT_MENU_Z_INDEX = 10000000;

// Zoom constants

export const ECHARTS_ZOOM_DEBOUNCE_MS = 300;

// viewport timestamp constants
export const TIMESTAMP_WIDTH_FACTOR = 44;
export const TIMESTAMP_WIDTH_FACTOR_BOTTOM = 24;
export const TIMESTAMP_HEIGHT_FACTOR_BOTTOM = 24;

// loading indicator
export const REFRESHING_DELAY_MS = 3000;

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
