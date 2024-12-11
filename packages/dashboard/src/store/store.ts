import { configureStore } from '@reduxjs/toolkit';
import cloneDeep from 'lodash-es/cloneDeep';
import merge from 'lodash/merge';
import undoable, { groupByActionTypes, includeAction } from 'redux-undo';
import {
  initialState as initialAssistantState,
  reducer as assistantReducer,
} from '#features/assistant/store';
import {
  reducer as contextMenuReducer,
  initialState as initialContextMenuState,
} from '#features/context-menu/store';
import {
  initialState as initialModeState,
  reducer as modeReducer,
} from '#features/mode/store';
import {
  initialState as initialPanelState,
  reducer as panelReducer,
} from '#features/panels/store';
import {
  initialState as initialSelectionState,
  reducer as selectionReducer,
} from '#features/selection/store';
import {
  initialState as initialSavingState,
  reducer as savingReducer,
} from '#features/saving/store';
import {
  reducer as dashboardConfigurationReducer,
  initialState as initialDashboardState,
  bringWidgetsToFront,
  createWidgets,
  deleteWidgets,
  moveWidgets,
  pasteWidgets,
  resizeWidgets,
  sendWidgetsToBack,
  updateCellSize,
  updateDecimalPlaces,
  updateHeight,
  updateRefreshRate,
  updateWidgets,
  updateWidth,
} from '../dashboard-configuration/store';
import type { RootState, PreloadedRootState } from './types';

export function createStore(preloadedState: PreloadedRootState) {
  /**
   * Merge modifies the source object so it must be cloned or initialState
   * will be shared between different instances of the dashboard store.
   */
  const mergedState: RootState = cloneDeep({
    assistant: initialAssistantState,
    mode: initialModeState,
    dashboard: { past: [], present: initialDashboardState, future: [] },
    selection: initialSelectionState,
    contextMenu: initialContextMenuState,
    saving: initialSavingState,
    panels: initialPanelState,
  });
  merge(mergedState, preloadedState);

  const store = configureStore({
    preloadedState: mergedState,
    reducer: {
      assistant: assistantReducer,
      mode: modeReducer,
      dashboard: undoable(dashboardConfigurationReducer, {
        filter: includeAction([
          createWidgets.type,
          deleteWidgets.type,
          bringWidgetsToFront.type,
          sendWidgetsToBack.type,
          moveWidgets.type,
          pasteWidgets.type,
          resizeWidgets.type,
          updateDecimalPlaces.type,
          updateRefreshRate.type,
          updateWidgets.type,
          updateCellSize.type,
          updateHeight.type,
          updateWidth.type,
        ]),
        // batch these actions since they dispatch many times in a row
        groupBy: groupByActionTypes([moveWidgets.type, resizeWidgets.type]),
      }),
      selection: selectionReducer,
      contextMenu: contextMenuReducer,
      saving: savingReducer,
      panels: panelReducer,
    },
    devTools: process.env.NODE_ENV === 'development',
  });

  return store;
}
