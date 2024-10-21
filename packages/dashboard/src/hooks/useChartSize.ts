import { useDashboardCellSize } from '~/store/dashboard/use-dashboard-cell-size';
import type { DashboardWidget } from '~/types';

export const useChartSize = (widget: DashboardWidget) => {
  const [cellSize] = useDashboardCellSize();

  return {
    width: cellSize * widget.width,
    height: cellSize * widget.height,
  };
};
