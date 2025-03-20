import type { Action } from 'redux';
import type { DashboardState } from '../../state';

interface DeleteWidgetsActionPayload {
  widgetIds: string[];
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
    selectedWidgets: state.selectedWidgets.filter(
      ({ id }) => !widgetIds.includes(id)
    ),
  };
};
