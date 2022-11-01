import { Reducer } from 'redux';

import { DashboardState, initialState } from './state';
import { DashboardAction, changeDashboardHeight, changeDashboardWidth, moveWidgets, selectWidgets } from './actions';

import { createWidgets } from './actions/createWidget';

export const dashboardReducer: Reducer<DashboardState, DashboardAction> = (
  state: DashboardState = initialState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case 'CREATE_WIDGETS': {
      return createWidgets(state, action);
    }

    case 'SELECT_WIDGETS': {
      return selectWidgets(state, action);
    }

    case 'CHANGE_WIDTH': {
      return changeDashboardWidth(state, action);
    }

    case 'CHANGE_HEIGHT': {
      return changeDashboardHeight(state, action);
    }

    case 'MOVE_WIDGETS': {
      return moveWidgets(state, action);
    }

    default:
      return state;
  }
};
