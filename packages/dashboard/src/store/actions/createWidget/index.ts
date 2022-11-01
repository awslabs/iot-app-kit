import { Action } from 'redux';

import { Widget } from '../../../types';
import { DashboardState } from '../../state';

type CreateWidgetsActionPayload = {
  widgets: Widget[];
};
export interface CreateWidgetsAction extends Action {
  type: 'CREATE_WIDGETS';
  payload: CreateWidgetsActionPayload;
}

export const onCreateWidgetsAction = (payload: CreateWidgetsActionPayload): CreateWidgetsAction => ({
  type: 'CREATE_WIDGETS',
  payload,
});

export const createWidgets = (state: DashboardState, action: CreateWidgetsAction): DashboardState => ({
  ...state,
  dashboardConfiguration: {
    ...state.dashboardConfiguration,
    widgets: [...state.dashboardConfiguration.widgets, ...action.payload.widgets],
  },
});
