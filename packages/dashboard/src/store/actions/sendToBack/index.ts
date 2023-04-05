import type { PayloadAction } from '@reduxjs/toolkit';
import type { DashboardState } from '../../state';

export interface SendWidgetsToBackAction extends PayloadAction<null> {
  type: 'SEND_WIDGETS_TO_BACK';
}

export const onSendWidgetsToBackAction = (): SendWidgetsToBackAction => ({
  type: 'SEND_WIDGETS_TO_BACK',
  payload: null,
});

export const sendWidgetsToBack = (state: DashboardState): DashboardState => {
  const widgets = state.dashboardConfiguration.widgets;
  const selectedWidgets = state.selectedWidgets;

  if (selectedWidgets.length === 0) return state;

  const selectedWidgetsIds = selectedWidgets.map(({ id }) => id);

  const translatedWidgets = widgets.map((widget) => ({
    ...widget,
    z: 3,
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
