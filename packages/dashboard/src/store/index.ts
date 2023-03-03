import { Store } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import merge from 'lodash/merge';

import { DashboardAction } from './actions';
import { DashboardState, initialState } from './state';
import { dashboardReducer } from './reducer';
import { RecursivePartial } from '~/types';

export type DashboardStore = Store<DashboardState, DashboardAction>;

export const configureDashboardStore = (preloadedState?: RecursivePartial<DashboardState>) => {
  const mergedState = merge(initialState, preloadedState);

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
