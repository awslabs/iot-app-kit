import { Action } from 'redux';

import { Widget } from '~/types';
import { constrainWidgetPositionToGrid } from '~/util/constrainWidgetPositionToGrid';
import { trimWidgetPosition } from '~/util/trimWidgetPosition';
import { DashboardState } from '../../state';

type UpdateWidgetsActionPayload = {
  widgets: Widget[];
};

export interface UpdateWidgetsAction extends Action {
  type: 'UPDATE_WIDGET';
  payload: UpdateWidgetsActionPayload;
}

export const onUpdateWidgetsAction = (payload: UpdateWidgetsActionPayload): UpdateWidgetsAction => ({
  type: 'UPDATE_WIDGET',
  payload,
});

export const updateWidgets = (state: DashboardState, action: UpdateWidgetsAction): DashboardState => {
  const widgets = action.payload.widgets
    .map((w) => constrainWidgetPositionToGrid({ x: 0, y: 0, width: state.grid.width, height: state.grid.height }, w))
    .map(trimWidgetPosition);

  const updatedWidgets = state.dashboardConfiguration.widgets.map((w) => {
    return widgets.find((k) => k.id === w.id) || w;
  });

  const updatedSelectedWidgets = state.selectedWidgets.map((w) => {
    return widgets.find((k) => k.id === w.id) || w;
  });

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: [...updatedWidgets],
    },
    selectedWidgets: [...updatedSelectedWidgets],
  };
};
