import { Store } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import { DashboardAction } from './actions';
import { DashboardState } from './state';
import { dashboardReducer } from './reducer';

export type DashboardStore = Store<DashboardState, DashboardAction>;

export const configureDashboardStore = (preloadedState?: DashboardState) =>
  configureStore({
    reducer: dashboardReducer,
    preloadedState,
  });
