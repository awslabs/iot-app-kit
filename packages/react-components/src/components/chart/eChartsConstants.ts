import { format } from 'd3-format';
import type {
  XAXisComponentOption,
  YAXisComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
  DataZoomComponentOption,
  ToolboxComponentOption,
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

export const DEFAULT_TOOL_BOX: ToolboxComponentOption = {
  show: true,
  showTitle: false,
  feature: {
    saveAsImage: {},
  },
  top: 10,
  right: 10,
};

export const DEFAULT_X_AXIS_ID = 'default-x-Axis';

export const DEFAULT_CHART_VISUALIZATION = 'line' as const;
// this is the chart live mode refresh rate, this should be inline with the animation props
// https://echarts.apache.org/en/option.html#animation
// packages/react-components/src/components/chart/converters , line 30
export const LIVE_MODE_REFRESH_RATE_MS = 1000;

// Trend Cursor constants
export const DEBUG_TREND_CURSORS = false;

export const TREND_CURSOR_HEADER_COLORS = ['#DA7596', '#2EA597', '#688AE8', '#A783E1', '#E07941'];
export const TREND_CURSOR_HEADER_WIDTH = 120;
export const TREND_CURSOR_LINE_COLOR = 'black';
export const TREND_CURSOR_LINE_WIDTH = 2;
export const TREND_CURSOR_Z_INDEX = 100;
export const MAX_TREND_CURSORS = 5;

export const TREND_CURSOR_HEADER_TEXT_COLOR = 'white';
export const TREND_CURSOR_HEADER_OFFSET = 28;
export const TREND_CURSOR_HEADER_BACKGROUND_COLOR = 'black';
export const TREND_CURSOR_CLOSE_BUTTON_Y_OFFSET = TREND_CURSOR_HEADER_OFFSET + 3;
export const TREND_CURSOR_CLOSE_BUTTON_X_OFFSET = 45;

export const DEFAULT_PRECISION = 4;
export const TREND_CURSOR_MARKER_RADIUS = 5;
export const TREND_CURSOR_DELETE_BUTTON_HEIGHT = 10;

export const TREND_CURSOR_LINE_GRAPHIC_INDEX = 0;
export const TREND_CURSOR_HEADER_GRAPHIC_INDEX = 1;
export const TREND_CURSOR_CLOSE_GRAPHIC_INDEX = 2;
export const TREND_CURSOR_LINE_MARKERS_GRAPHIC_INDEX = 3;

// resize constants
export const CHART_RESIZE_INITIAL_FACTOR = 0.75;
export const CHART_RESIZE_MIN_FACTOR = 0.3;
export const CHART_RESIZE_MAX_FACTOR = 0.75;

export const MULTI_Y_AXIS_LEGEND_WIDTH = 172;

// style constants
export const EMPHASIZE_SCALE_CONSTANT = 2;
export const DEEMPHASIZE_OPACITY = 0.25;
