import { type LineSeriesOption } from 'echarts/types/src/chart/line/LineSeries.js';

// the first y-axis is the default chart y-axis
export const hasCustomYAxis = (option: LineSeriesOption) =>
  option.yAxisIndex && option.yAxisIndex > 0;

export const handlesYAxis = (type: string) =>
  ['series.line', 'series.scatter'].includes(type);
