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

export const DEFAULT_GRID: GridComponentOption = {
  left: '16',
  top: '8%',
  right: '16',
  bottom: '32',
  containLabel: true,
};

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

export const DEFAULT_ECHART_OPTIONS: EChartsOption = {
  xAxis: DEFAULT_X_AXIS,
  yAxis: DEFAULT_Y_AXIS,
  legend: DEFAULT_LEGEND,
  grid: DEFAULT_GRID,
  tooltip: DEFAULT_TOOLTIP,
  dataZoom: DEFAULT_DATA_ZOOM,
};
