import { type DashboardWidget } from '../../../types';

export const getCorrectSelectionMode = (selectedWidgets: DashboardWidget[]) => {
  return selectedWidgets.at(0)?.type === 'kpi' ||
    selectedWidgets.at(0)?.type === 'gauge'
    ? 'single'
    : 'multi';
};
