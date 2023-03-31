import { constrainWidgetPositionToGrid } from '~/util/constrainWidgetPositionToGrid';
import { trimRectPosition } from '~/util/trimRectPosition';
import type { Action } from 'redux';
import type { DashboardWidget } from '~/types';
import type { DashboardState } from '../../state';

type CreateWidgetsActionPayload = {
  widgets: DashboardWidget[];
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
    .map(trimRectPosition);

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      widgets: [...state.dashboardConfiguration.widgets, ...widgets],
    },
    selectedWidgets: widgets,
  };
};
