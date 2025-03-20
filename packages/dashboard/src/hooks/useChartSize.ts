import { useSelector } from 'react-redux';
import { type DashboardState } from '~/store/state';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export const useChartSize = (widget: WidgetInstance) => {
  const grid = useSelector((state: DashboardState) => state.grid);

  return {
    width: grid.cellSize * widget.width,
    height: grid.cellSize * widget.height,
  };
};
