import { Reducer } from 'redux';

import { DashboardState, initialState } from './state';
import {
  DashboardAction,
  changeDashboardHeight,
  changeDashboardWidth,
  moveWidgets,
  selectWidgets,
  resizeWidgets,
  deleteWidgets,
} from './actions';

import { createWidgets } from './actions/createWidget';

export const dashboardReducer: Reducer<DashboardState, DashboardAction> = (
  state: DashboardState = initialState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case 'CHANGE_WIDTH': {
      return changeDashboardWidth(state, action);
    }

    case 'CHANGE_HEIGHT': {
      return changeDashboardHeight(state, action);
    }

    case 'CREATE_WIDGETS': {
      return createWidgets(state, action);
    }

    case 'DELETE_WIDGETS': {
      return deleteWidgets(state, action);
    }

    case 'SELECT_WIDGETS': {
      return selectWidgets(state, action);
    }

    case 'MOVE_WIDGETS': {
      return moveWidgets(state, action);
    }

    case 'RESIZE_WIDGETS': {
      return resizeWidgets(state, action);
    }

    default:
      return state;
  }
};
