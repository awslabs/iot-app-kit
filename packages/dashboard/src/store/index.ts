import { configureStore } from '@reduxjs/toolkit';
import cloneDeep from 'lodash-es/cloneDeep';
import merge from 'lodash-es/merge';
import type { Store } from 'redux';
import type { PartialDeep } from 'type-fest';
import type { DashboardConfiguration } from '~/types';
import type { DashboardAction } from './actions';
import { dashboardReducer } from './reducer';
import type { DashboardState } from './state';
import { initialState } from './state';

export type DashboardStore = Store<DashboardState, DashboardAction>;

export const configureDashboardStore = (
  preloadedState?: PartialDeep<DashboardState>
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
): PartialDeep<DashboardState> => {
  const { widgets, displaySettings, querySettings, defaultViewport } =
    dashboardConfiguration;
  const { numRows, numColumns, cellSize } = displaySettings;

  const state: PartialDeep<DashboardState> = {
    grid: {
      height: numRows,
      width: numColumns,
      cellSize,
    },
    dashboardConfiguration: {
      widgets,
      querySettings,
    },
    significantDigits: dashboardConfiguration.displaySettings.significantDigits,
  };

  const viewportString = JSON.stringify(defaultViewport);
  if (state.dashboardConfiguration && viewportString) {
    state.dashboardConfiguration.defaultViewport = viewportString;
  }
  return state;
};
