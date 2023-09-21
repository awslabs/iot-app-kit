import { DEFAULT_TOOL_BOX } from '../eChartsConstants';
import { convertGrid } from './convertGrid';
import { convertTooltip } from './convertTooltip';
import { useMemo } from 'react';
import { ChartOptions } from '../types';
import { EChartsOption, SeriesOption } from 'echarts';

type ConvertChartOptions = Pick<
  ChartOptions,
  'backgroundColor' | 'axis' | 'gestures' | 'legend' | 'significantDigits' | 'titleText' | 'defaultVisualizationType'
>;

/**
 * Hook that adapts chart options to echarts options.
 *
 * @param options options object to adapt to the echarts
 * @param series options object to adapt to the echarts
 * @returns memoized adapted echarts options
 */
export const useConvertedOptions = ({
  series,
  options,
  shouldShowYAxisLegend,
}: {
  options: ConvertChartOptions;
  series: SeriesOption[];
  shouldShowYAxisLegend: boolean;
}): EChartsOption => {
  const { backgroundColor, axis, significantDigits, titleText, defaultVisualizationType } = options;
  const text = series.length === 0 ? 'No data present' : titleText ?? defaultVisualizationType ?? '';
  return useMemo(
    () => ({
      aria: {
        enabled: true,
      },
      title: {
        text,
        top: 10,
      },
      backgroundColor,
      grid: convertGrid(options.legend, shouldShowYAxisLegend),
      tooltip: convertTooltip(significantDigits),
      toolbox: DEFAULT_TOOL_BOX,
    }),
    [backgroundColor, axis, significantDigits, text]
  );
};
