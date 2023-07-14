import { format } from 'd3-format';
import type {
  EChartsOption,
  XAXisComponentOption,
  YAXisComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
  DataZoomComponentOption,
} from 'echarts';

export const DEFAULT_X_AXIS: XAXisComponentOption = {
  show: true,
  type: 'time',
  splitNumber: 5,
};

export const DEFAULT_Y_AXIS: YAXisComponentOption = {
  show: true,
  type: 'value',
  axisLabel: { formatter: format('.2s') },
  position: 'left',
};
export const DEFAULT_LEGEND: LegendComponentOption = {
  show: true,
  type: 'scroll',
  orient: 'horizontal',
  left: 'left',
  bottom: '0',
};

// if you change this, please update the width calculation
export const DEFAULT_MARGIN = 50;
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
  start: 0,
  end: 100,
  zoomOnMouseWheel: true,
  moveOnMouseMove: true,
  moveOnMouseWheel: false,
};

export const DEFAULT_ECHARTS_OPTIONS: EChartsOption = {
  xAxis: [DEFAULT_X_AXIS],
  yAxis: [DEFAULT_Y_AXIS],
  legend: DEFAULT_LEGEND,
  grid: DEFAULT_GRID,
  tooltip: DEFAULT_TOOLTIP,
  dataZoom: DEFAULT_DATA_ZOOM,
};

// Trend Cursor constants
export const trendCursorHeaderColors = ['#DA7596', '#2EA597', '#688AE8', '#A783E1', '#E07941'];
export const trendCursorLineColor = '#5F6B7A';
export const trendCursorHeaderWidth = 110;
export const trendCursorHeaderHeight = 110;
export const trendCursorLineWidth = 2;
export const trendCursorZIndex = 100;
export const MAX_TREND_CURSORS = 5;

export const trendCursorHeaderTextColor = 'white';
export const trendCursorHeaderBackgroundColor = 'black';
export const trendCursorCloseButtonYOffset = DEFAULT_MARGIN + 2.5;
export const trendCursorCloseButtonXOffset = 40;

export const Y_AXIS_INTERPOLATED_VALUE_PRECISION = 3;
export const trendCursorMarkerRadius = 5;
