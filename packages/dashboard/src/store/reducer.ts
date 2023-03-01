import { Reducer } from 'redux';

import { DashboardState, initialState } from './state';
import {
  bringWidgetsToFront,
  changeDashboardGridDragEnabled,
  changeDashboardHeight,
  changeDashboardWidth,
  copyWidgets,
  DashboardAction,
  deleteWidgets,
  moveWidgets,
  pasteWidgets,
  resizeWidgets,
  selectWidgets,
  sendWidgetsToBack,
  toggleReadOnly,
  updateViewport,
  updateWidgets,
} from './actions';

import { createWidgets } from '~/store/actions';
import { updateAssetQuery } from './actions/updateAssetQuery';
import { updateAssetDescriptionMap } from './actions/updateAssetsDescription';
import { describeAssetFailed } from './sagas/describeAsset/failed';
import { updateTableAssets } from '~/store/actions/updateTableWidget';

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

    case 'UPDATE_VIEWPORT': {
      return updateViewport(state, action);
    }

    case 'UPDATE_ASSET_QUERY': {
      return updateAssetQuery(state, action);
    }

    case 'UPDATE_ASSETS_DESCRIPTION': {
      return updateAssetDescriptionMap(state, action);
    }

    case 'DESCRIBE_ASSET_FAILED': {
      return describeAssetFailed(state, action);
    }

    case 'TOGGLE_READ_ONLY': {
      return toggleReadOnly(state);
    }

    case 'UPDATE_TABLE_ASSET': {
      return updateTableAssets(state, action);
    }

    default:
      return state;
  }
};
