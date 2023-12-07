import { LegendComponentOption } from 'echarts';
import { DEFAULT_LEGEND } from '../eChartsConstants';
import { ChartOptions } from '../types';

const unsetPosition = { top: undefined, bottom: undefined };

export const convertLegend = (legend: ChartOptions['legend']): LegendComponentOption => {
  const configuredPosition = legend?.position && { ...unsetPosition, [legend.position]: 0 };

  return {
    ...DEFAULT_LEGEND,
    ...configuredPosition,
  };
};
