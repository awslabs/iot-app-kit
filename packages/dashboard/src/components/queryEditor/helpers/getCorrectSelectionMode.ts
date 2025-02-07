import { type WidgetInstance } from '~/features/widget-instance/instance';

// TODO: Move single-/multi-select configuration handling to plugins
export const getCorrectSelectionMode = (selectedWidgets: WidgetInstance[]) => {
  return selectedWidgets.at(0)?.type === 'kpi' ||
    selectedWidgets.at(0)?.type === 'gauge'
    ? 'single'
    : 'multi';
};
