import { Action } from 'redux';

import { AnyWidget } from '~/types';
import { constrainWidgetPositionToGrid } from '~/util/constrainWidgetPositionToGrid';
import { trimWidgetPosition } from '~/util/trimWidgetPosition';
import { DashboardState } from '../../state';

type CreateWidgetsActionPayload = {
  widgets: AnyWidget[];
};
export interface CreateWidgetsAction extends Action {
  type: 'CREATE_WIDGETS';
  payload: CreateWidgetsActionPayload;
}

export const onCreateWidgetsAction = (payload: CreateWidgetsActionPayload): CreateWidgetsAction => ({
  type: 'CREATE_WIDGETS',
  payload,
});

export const createWidgets = (state: DashboardState, action: CreateWidgetsAction): DashboardState => {
  const widgets = action.payload.widgets
    .map((w) => constrainWidgetPositionToGrid({ x: 0, y: 0, width: state.grid.width, height: state.grid.height }, w))
    .map(trimWidgetPosition);

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: [...state.dashboardConfiguration.widgets, ...widgets],
    },
    selectedWidgets: widgets,
  };
};
