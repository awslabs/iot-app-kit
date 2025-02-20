import type { RegisteredWidget } from '~/types/widgets';

export const getCorrectSelectionMode = (
  selectedWidgets: RegisteredWidget[]
) => {
  return selectedWidgets.at(0)?.type === 'kpi' ||
    selectedWidgets.at(0)?.type === 'gauge'
    ? 'single'
    : 'multi';
};
