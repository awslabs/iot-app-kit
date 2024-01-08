import { useSelector } from 'react-redux';
import { DashboardState } from '~/store/state';
import { DashboardWidget } from '~/types';

export const useChartSize = (widget: DashboardWidget) => {
  const grid = useSelector((state: DashboardState) => state.grid);

  return {
    width: grid.cellSize * widget.width,
    height: grid.cellSize * widget.height,
  };
};
