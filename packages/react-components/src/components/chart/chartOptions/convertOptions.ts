import { convertGrid } from './convertGrid';
import { convertTooltip } from './convertTooltip';
import { useMemo } from 'react';
import { ChartOptions } from '../types';
import { EChartsOption, SeriesOption } from 'echarts';

type ConvertChartOptions = Pick<
  ChartOptions,
  | 'backgroundColor'
  | 'axis'
  | 'gestures'
  | 'legend'
  | 'significantDigits'
  | 'titleText'
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
}: {
  options: ConvertChartOptions;
  series: SeriesOption[];
}): EChartsOption => {
  const { backgroundColor, significantDigits, titleText } = options;
  const text = series.length === 0 ? 'No data present' : titleText ?? '';
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
      grid: convertGrid(options.legend),
      tooltip: convertTooltip(significantDigits),
    }),
    [backgroundColor, significantDigits, text, options.legend]
  );
};
