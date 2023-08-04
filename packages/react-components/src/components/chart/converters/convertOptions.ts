import { ChartOptions } from '../types';
import { EChartsOption } from 'echarts';
import { DEFAULT_DATA_ZOOM } from '../eChartsConstants';
import { convertLegend } from './convertLegend';
import { convertXAxis, convertYAxis } from './convertAxis';
import { convertGrid } from './convertGrid';
import { convertTooltip } from './convertTooltip';

export const convertOptions = (options: ChartOptions): EChartsOption => {
  const { backgroundColor, axis, gestures, legend, significantDigits } = options;
  return {
    backgroundColor,
    xAxis: [convertXAxis(axis)],
    yAxis: [convertYAxis(axis)],
    grid: convertGrid(legend),
    dataZoom: gestures ? DEFAULT_DATA_ZOOM : undefined,
    legend: convertLegend(legend),
    tooltip: convertTooltip(significantDigits),
  };
};
