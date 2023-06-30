import { DEFAULT_GRID, DEFAULT_MARGIN } from '../eChartsConstants';
import { ChartOptions } from '../types';

const unsetGutter = {
  bottom: DEFAULT_MARGIN,
  top: DEFAULT_MARGIN,
};

export const convertGrid = (legend: ChartOptions['legend']) => {
  const legendPosition = legend?.position ?? 'bottom';

  return {
    ...DEFAULT_GRID,
    ...unsetGutter,
    [legendPosition]: DEFAULT_MARGIN,
  };
};
