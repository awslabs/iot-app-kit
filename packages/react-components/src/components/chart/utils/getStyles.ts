import { ChartOptions, ChartStyleSettingsOptions } from '../types';
import { getColor } from './getColor';

export const getStyles = (refId?: string, styleSettings?: ChartOptions['styleSettings']) =>
  refId && styleSettings ? styleSettings[refId] : undefined;

export const getDefaultStyles = (
  defaultVisualizationType?: ChartStyleSettingsOptions['visualizationType']
): ChartStyleSettingsOptions => {
  return {
    visualizationType: defaultVisualizationType ?? 'line',
    color: getColor(),
    symbol: 'circle',
    symbolSize: 4,
    symbolColor: undefined, // will use color if undefined
    lineStyle: 'solid',
    lineThickness: 2,
    yAxis: undefined,
    significantDigits: 4,
  };
};
