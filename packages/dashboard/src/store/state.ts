import { DashboardConfiguration, Widget } from '../types';

export type DashboardState = {
  width: number;
  cellSize: number;
  selectedWidgets: Widget[];
  dashboardConfiguration: DashboardConfiguration;
};

export const initialState: DashboardState = {
  width: 450,
  cellSize: 10,
  selectedWidgets: [],
  dashboardConfiguration: {
    viewport: { duration: '5m' },
    widgets: [],
  },
};
