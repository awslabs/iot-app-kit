import { Store } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import merge from 'lodash/merge';

import { DashboardAction } from './actions';
import { DashboardState, initialState } from './state';
import { dashboardReducer } from './reducer';

export type DashboardStore = Store<DashboardState, DashboardAction>;

export const configureDashboardStore = (preloadedState?: Partial<DashboardState>) =>
  configureStore({
    reducer: dashboardReducer,
    preloadedState: merge(initialState, preloadedState),
  });
