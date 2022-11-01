import { Reducer } from 'redux';

import { DashboardState, initialState } from './state';
import { DashboardAction } from './actions';

import { createWidgets } from './actions/createWidget';

export const dashboardReducer: Reducer<DashboardState, DashboardAction> = (
  state: DashboardState = initialState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case 'CREATE_WIDGETS':
      return createWidgets(state, action);

    default:
      return state;
  }
};
