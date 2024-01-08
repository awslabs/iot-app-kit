import { ChartOptions, ChartStyleSettingsOptions } from '../types';

export type Emphasis = 'none' | 'emphasize' | 'de-emphasize';

export const getStyles = (
  refId?: string,
  styleSettings?: ChartOptions['styleSettings']
): ChartStyleSettingsOptions | undefined =>
  refId && styleSettings ? styleSettings[refId] : undefined;

type OptionalChartStyleSettingsOptions = Pick<
  ChartStyleSettingsOptions,
  'symbolColor' | 'yAxis' | 'color'
>;
export type ChartStyleSettingsWithDefaults = Omit<
  Required<ChartStyleSettingsOptions>,
  keyof OptionalChartStyleSettingsOptions
> &
  OptionalChartStyleSettingsOptions & { emphasis: Emphasis; hidden: boolean };

export const getDefaultStyles = (
  defaultVisualizationType?: ChartStyleSettingsOptions['visualizationType'],
  significantDigits?: ChartStyleSettingsOptions['significantDigits']
): ChartStyleSettingsWithDefaults => {
  return {
    visualizationType: defaultVisualizationType ?? 'line',
    symbol: 'circle',
    symbolSize: 4,
    symbolColor: undefined, // will use color if undefined
    lineStyle: 'solid',
    lineThickness: 2,
    yAxis: undefined,
    significantDigits: significantDigits ?? 4,
    emphasis: 'none',
    hidden: false,
  };
};
