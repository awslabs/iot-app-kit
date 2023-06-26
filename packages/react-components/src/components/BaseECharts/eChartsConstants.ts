import { format } from 'd3-format';
import type {
  EChartsOption,
  XAXisComponentOption,
  YAXisComponentOption,
  LegendComponentOption,
  GridComponentOption,
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
};

export const DEFAULT_LEGEND: LegendComponentOption = {
  show: true,
  type: 'scroll',
  orient: 'horizontal',
  left: 'left',
  height: 32,
  bottom: '0',
  padding: [5, 20],
};
export const DEFAULT_MARGIN = '50';
export const DEFAULT_GRID: GridComponentOption = {
  left: DEFAULT_MARGIN,
  top: DEFAULT_MARGIN,
  right: DEFAULT_MARGIN,
  bottom: DEFAULT_MARGIN,
  containLabel: false,
};

export const DEFAULT_TOOLTIP: TooltipComponentOption = {
  trigger: 'axis',
  show: true,
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

// tool tip constants
export const tooltipColors = ['#DA7596', '#2EA597', '#688AE8'];
export const tooltipLineColor = '#5F6B7A';
export const tooltipNameWidth = 60;
export const tooltipNameHeight = 20;

export const DEFAULT_ECHART_OPTIONS: EChartsOption = {
  xAxis: DEFAULT_X_AXIS,
  yAxis: DEFAULT_Y_AXIS,
  legend: DEFAULT_LEGEND,
  grid: DEFAULT_GRID,
  tooltip: DEFAULT_TOOLTIP,
  dataZoom: DEFAULT_DATA_ZOOM,
  graphic: [],
};
