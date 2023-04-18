import { configureStore } from '@reduxjs/toolkit';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { initialState } from './state';
import { dashboardReducer } from './reducer';
import type { Store } from 'redux';
import type { DashboardAction } from './actions';
import type { DashboardState } from './state';
import type { RecursivePartial, DashboardConfiguration } from '~/types';

export type DashboardStore = Store<DashboardState, DashboardAction>;

export const configureDashboardStore = (preloadedState?: RecursivePartial<DashboardState>) => {
  /**
   * Merge modifies the source object so it must be cloned or initialState
   * will be shared between different instances of the dashboard store.
   */
  const mergedState = cloneDeep(initialState);
  merge(mergedState, preloadedState);

  const store = configureStore({
    reducer: dashboardReducer,
    preloadedState: {
      ...mergedState,
      dashboardConfiguration: {
        ...mergedState.dashboardConfiguration,
        // The viewport object has a different property set depending on whether it's relative or absolute so merging does not create the correct type
        viewport: (preloadedState?.dashboardConfiguration?.viewport ||
          initialState.dashboardConfiguration.viewport) as DashboardState['dashboardConfiguration']['viewport'],
      },
    },
  });

  return store;
};

export const toDashboardState = (dashboardConfiguration: DashboardConfiguration): RecursivePartial<DashboardState> => {
  const { viewport, widgets, displaySettings } = dashboardConfiguration;
  const { numRows, numColumns, cellSize } = displaySettings;

  return {
    grid: {
      height: numRows,
      width: numColumns,
      cellSize,
      stretchToFit: !cellSize,
    },
    dashboardConfiguration: {
      viewport,
      widgets,
    },
  };
};
