import { ChartOptions } from '../types';
import { EChartsOption } from 'echarts';
import { DEFAULT_DATA_ZOOM } from '../eChartsConstants';
import { convertLegend } from './convertLegend';
import { convertXAxis } from './convertAxis';
import { convertGrid } from './convertGrid';
import { convertTooltip } from './convertTooltip';

export const convertOptions = (options: ChartOptions & { seriesLength: number }): EChartsOption => {
  const { backgroundColor, axis, gestures, legend, significantDigits } = options;
  return {
    title: {
      text: options.seriesLength === 0 ? 'No data present' : '',
    },
    backgroundColor,
    xAxis: [convertXAxis(axis)],
    grid: convertGrid(legend),
    dataZoom: gestures ? DEFAULT_DATA_ZOOM : undefined,
    legend: convertLegend(legend),
    tooltip: convertTooltip(significantDigits),
  };
};
