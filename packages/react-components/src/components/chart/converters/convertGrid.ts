import { DEFAULT_GRID, DEFAULT_MARGIN } from '../eChartsConstants';
import { ChartOptions } from '../types';

const unsetGutter = {
  bottom: DEFAULT_MARGIN,
  top: DEFAULT_MARGIN,
};

export const convertGrid = (legend: ChartOptions['legend'], shouldShowYAxisLegend: boolean) => {
  const legendPosition = legend?.position ?? 'bottom';

  const multiYAxisPadding = shouldShowYAxisLegend
    ? {
        left: 5,
      }
    : {};

  return {
    ...DEFAULT_GRID,
    ...unsetGutter,
    ...multiYAxisPadding,
    [legendPosition]: DEFAULT_MARGIN,
  };
};
