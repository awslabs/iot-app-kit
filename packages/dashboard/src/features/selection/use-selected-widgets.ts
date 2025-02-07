import { useSelector } from 'react-redux';
import type { DashboardState } from '~/store/state';

export function useSelectedWidgets() {
  return useSelector((state: DashboardState) => state.selectedWidgets);
}
