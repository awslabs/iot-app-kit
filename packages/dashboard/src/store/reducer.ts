import { initialState } from './state';
import {
  bringWidgetsToFront,
  changeDashboardCellSize,
  changeDashboardGridDragEnabled,
  changeDashboardHeight,
  changeDashboardWidth,
  copyWidgets,
  deleteWidgets,
  moveWidgets,
  pasteWidgets,
  resizeWidgets,
  selectWidgets,
  sendWidgetsToBack,
  toggleReadOnly,
  updateSignificantDigits,
  updateWidgets,
} from './actions';

import { createWidgets } from './actions/createWidget';
import type { Reducer } from 'redux';
import type { DashboardState } from './state';
import type { DashboardAction } from './actions';

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

    case 'CHANGE_CELL_SIZE': {
      return changeDashboardCellSize(state, action);
    }

    case 'CHANGE_ENABLED': {
      return changeDashboardGridDragEnabled(state, action);
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

    case 'COPY_WIDGETS': {
      return copyWidgets(state, action);
    }

    case 'PASTE_WIDGETS': {
      return pasteWidgets(state, action);
    }

    case 'MOVE_WIDGETS': {
      return moveWidgets(state, action);
    }

    case 'BRING_WIDGETS_TO_FRONT': {
      return bringWidgetsToFront(state);
    }

    case 'SEND_WIDGETS_TO_BACK': {
      return sendWidgetsToBack(state);
    }

    case 'RESIZE_WIDGETS': {
      return resizeWidgets(state, action);
    }

    case 'UPDATE_WIDGET': {
      return updateWidgets(state, action);
    }

    case 'TOGGLE_READ_ONLY': {
      return toggleReadOnly(state);
    }

    case 'UPDATE_SIGNIFICANT_DIGITS': {
      return updateSignificantDigits(state, action);
    }

    default:
      return state;
  }
};
