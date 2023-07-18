import { format } from 'd3-format';
import type {
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
  start: 0,
  end: 100,
  zoomOnMouseWheel: true,
  moveOnMouseMove: true,
  moveOnMouseWheel: false,
};

// Trend Cursor constants
export const TREND_CURSOR_HEADER_COLORS = ['#DA7596', '#2EA597', '#688AE8', '#A783E1', '#E07941'];
export const TREND_CURSOR_HEADER_WIDTH = 110;
export const TREND_CURSOR_HEADER_HEIGHT = 110;
export const TREND_CURSOR_LINE_COLOR = '#5F6B7A';
export const TREND_CURSOR_LINE_WIDTH = 2;
export const TREND_CURSOR_Z_INDEX = 100;
export const MAX_TREND_CURSORS = 5;

export const TREND_CURSOR_HEADER_TEXT_COLOR = 'white';
export const TREND_CURSOR_HEADER_BACKGROUND_COLOR = 'black';
export const TREND_CURSOR_CLOSE_BUTTON_Y_OFFSET = DEFAULT_MARGIN + 2.5;
export const TREND_CURSOR_CLOSE_BUTTON_X_OFFSET = 40;

export const Y_AXIS_INTERPOLATED_VALUE_PRECISION = 3;
export const TREND_CURSOR_MARKER_RADIUS = 5;
