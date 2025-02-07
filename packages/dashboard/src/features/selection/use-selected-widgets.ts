import { useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export type UseSelectedWidgetsResult = WidgetInstance[];

export function useSelectedWidgets(): UseSelectedWidgetsResult {
  const selectedWidgets = useSelector(
    (state: DashboardState) => state.selectedWidgets
  );
  console.info('RUNNING useSelectedWidgets', selectedWidgets);
  return selectedWidgets;
}
