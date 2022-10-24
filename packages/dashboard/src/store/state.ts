import { DashboardConfiguration } from '../types';

export type DashboardState = {
  dashboardConfiguration: DashboardConfiguration;
};

export const initialState: DashboardState = {
  dashboardConfiguration: {
    viewport: { duration: '5m' },
    widgets: [],
  },
};
