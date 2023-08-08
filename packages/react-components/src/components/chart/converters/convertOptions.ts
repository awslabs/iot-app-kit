import { ChartOptions } from '../types';
import { EChartsOption } from 'echarts';
import { DEFAULT_DATA_ZOOM } from '../eChartsConstants';
import { convertLegend } from './convertLegend';
import { convertXAxis } from './convertAxis';
import { convertGrid } from './convertGrid';
import { convertTooltip } from './convertTooltip';
import { useMemo } from 'react';

type ConvertChartOptions = Pick<
  ChartOptions,
  'backgroundColor' | 'axis' | 'gestures' | 'legend' | 'significantDigits'
> & { title?: string };

/**
 * @param options options object to adapt to the echarts
 * @returns adapted echarts options
 */
export const convertOptions = (options: ConvertChartOptions): EChartsOption => {
  const { backgroundColor, axis, gestures, legend, significantDigits, title } = options;
  return {
    title: {
      text: title, // options.seriesLength === 0 ? 'No data present' : '',
    },
    backgroundColor,
    xAxis: [convertXAxis(axis)],
    grid: convertGrid(legend),
    dataZoom: gestures ? DEFAULT_DATA_ZOOM : undefined,
    legend: convertLegend(legend),
    tooltip: convertTooltip(significantDigits),
  };
};

/**
 * Hook that adapts chart options to echarts options.
 *
 * @param options options object to adapt to the echarts
 * @returns memoized adapted echarts options
 */
export const useConvertedOptions = (options: ConvertChartOptions) => {
  const { backgroundColor, axis, gestures, legend, significantDigits, title } = options;
  return useMemo(() => convertOptions(options), [backgroundColor, axis, gestures, legend, significantDigits, title]);
};
