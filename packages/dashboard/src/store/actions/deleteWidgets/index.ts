import type { Action } from 'redux';
import type { DashboardState } from '../../state';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface DeleteWidgetsActionPayload {
  widgets: WidgetInstance[];
}

export interface DeleteWidgetsAction extends Action {
  type: 'DELETE_WIDGETS';
  payload: DeleteWidgetsActionPayload;
}

export const onDeleteWidgetsAction = (
  payload: DeleteWidgetsActionPayload
): DeleteWidgetsAction => ({
  type: 'DELETE_WIDGETS',
  payload,
});

export const deleteWidgets = (
  state: DashboardState,
  action: DeleteWidgetsAction
): DashboardState => {
  const widgetIdsToDelete = action.payload.widgets.map(({ id }) => id);

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: state.dashboardConfiguration.widgets.filter(
        ({ id }) => !widgetIdsToDelete.includes(id)
      ),
    },
    selectedWidgets: state.selectedWidgets.filter(
      ({ id }) => !widgetIdsToDelete.includes(id)
    ),
  };
};
