import type { PayloadAction } from '@reduxjs/toolkit';
import type { DashboardState } from '../../state';

export interface BringWidgetsToFrontAction extends PayloadAction<null> {
  type: 'BRING_WIDGETS_TO_FRONT';
}

export const onBringWidgetsToFrontAction = (): BringWidgetsToFrontAction => ({
  type: 'BRING_WIDGETS_TO_FRONT',
  payload: null,
});

export const bringWidgetsToFront = (state: DashboardState): DashboardState => {
  const widgets = state.dashboardConfiguration.widgets;
  const selectedWidgets = state.selectedWidgets;

  if (selectedWidgets.length === 0) return state;

  const selectedWidgetsIds = selectedWidgets.map(({ id }) => id);
  const translatedWidgets = widgets.map((widget) => ({
    ...widget,
    z: undefined,
  }));

  const translatedSelectedWidgets = translatedWidgets.filter((widget) => selectedWidgetsIds.includes(widget.id));

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: translatedWidgets,
    },
    selectedWidgets: translatedSelectedWidgets,
  };
};
