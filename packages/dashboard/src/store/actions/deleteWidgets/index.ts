import { Action } from 'redux';

import { AnyWidget } from '~/types';
import { DashboardState } from '../../state';

type DeleteWidgetsActionPayload = {
  widgets: AnyWidget[];
};
export interface DeleteWidgetsAction extends Action {
  type: 'DELETE_WIDGETS';
  payload: DeleteWidgetsActionPayload;
}

export const onDeleteWidgetsAction = (payload: DeleteWidgetsActionPayload): DeleteWidgetsAction => ({
  type: 'DELETE_WIDGETS',
  payload,
});

export const deleteWidgets = (state: DashboardState, action: DeleteWidgetsAction): DashboardState => {
  const widgetIdsToDelete = action.payload.widgets.map(({ id }) => id);

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: state.dashboardConfiguration.widgets.filter(({ id }) => !widgetIdsToDelete.includes(id)),
    },
    selectedWidgets: state.selectedWidgets.filter(({ id }) => !widgetIdsToDelete.includes(id)),
  };
};
