import {
  configureStore,
  type PreloadedState,
  type Reducer,
  type StateFromReducersMapObject,
} from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import undoable, {
  groupByActionTypes,
  includeAction,
  type StateWithHistory,
} from 'redux-undo';
import type { PartialDeep } from 'type-fest';
import {
  contextMenuReducer,
  initialContextMenuState,
} from '~/features/context-menu';
import {
  initialState as initialModeState,
  modeReducer,
} from '~/features/dashboard-mode';
import { initialPanelState, panelReducer } from '~/features/dashboard-panels';
import {
  initialState as initialSelectionState,
  selectionReducer,
} from '~/features/widget-selection/selection-store';
import {
  savingInitialState,
  savingReducer,
} from '../features/dashboard-saving/saving-store';
import {
  bringWidgetsToFront,
  createWidgets,
  dashboardConfigurationReducer,
  DashboardState,
  deleteWidgets,
  initialState as initialDashboardState,
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
} from './dashboard/reducer';

export type Store = ReturnType<typeof createStore>;
export type RootState = StateFromReducersMapObject<{
  mode: typeof modeReducer;
  dashboard: Reducer<StateWithHistory<DashboardState>>;
  selection: typeof selectionReducer;
  contextMenu: typeof contextMenuReducer;
  saving: typeof savingReducer;
  panels: typeof panelReducer;
}>;
export type Dispatch = Store['dispatch'];
export type PreloadedRootState = PartialDeep<PreloadedState<RootState>>;

export function createStore(preloadedState: PreloadedRootState) {
  /**
   * Merge modifies the source object so it must be cloned or initialState
   * will be shared between different instances of the dashboard store.
   */
  const mergedState: RootState = cloneDeep({
    mode: initialModeState,
    dashboard: { past: [], present: initialDashboardState, future: [] },
    selection: initialSelectionState,
    contextMenu: initialContextMenuState,
    saving: savingInitialState,
    panels: initialPanelState,
  });
  merge(mergedState, preloadedState);

  const store = configureStore({
    preloadedState: mergedState,
    reducer: {
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
    devTools: true,
  });

  return store;
}
