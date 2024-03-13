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

export const configureDashboardStore = (
  preloadedState?: RecursivePartial<DashboardState>
) => {
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
      },
    },
  });

  return store;
};

export const toDashboardState = (
  dashboardConfiguration: DashboardConfiguration
): RecursivePartial<DashboardState> => {
  const { widgets, displaySettings } = dashboardConfiguration;
  const { numRows, numColumns, cellSize } = displaySettings;

  return {
    grid: {
      height: numRows,
      width: numColumns,
      cellSize,
    },
    dashboardConfiguration: {
      widgets,
    },
  };
};
