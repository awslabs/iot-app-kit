import type { Action } from 'redux';
import type { DashboardState } from '../../state';

export interface DeleteWidgetsActionPayload {
  widgetIds: readonly string[];
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
  { payload: { widgetIds } }: DeleteWidgetsAction
): DashboardState => {
  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: state.dashboardConfiguration.widgets.filter(
        ({ id }) => !widgetIds.includes(id)
      ),
    },
    selectedWidgetIds: state.selectedWidgetIds.filter(
      (id) => !widgetIds.includes(id)
    ),
  };
};
