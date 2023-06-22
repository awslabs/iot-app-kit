import { DEFAULT_GRID, GRID_GUTTER, LEGEND_HEIGHT } from '../eChartsConstants';
import { ChartOptions } from '../types';

const unsetGutter = {
  bottom: GRID_GUTTER,
  top: GRID_GUTTER,
};

export const convertGrid = (legend: ChartOptions['legend']) => {
  const legendPosition = legend?.position ?? 'bottom';

  return {
    ...DEFAULT_GRID,
    ...unsetGutter,
    [legendPosition]: LEGEND_HEIGHT * 2,
  };
};
