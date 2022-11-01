import { DashboardConfiguration, Widget } from '../types';

export type DashboardState = {
  grid: {
    width: number;
    height: number;
    cellSize: number;
    stretchToFit: boolean;
  };
  selectedWidgets: Widget[];
  dashboardConfiguration: DashboardConfiguration;
};

export const initialState: DashboardState = {
  grid: {
    width: 100,
    height: 100,
    cellSize: 10,
    stretchToFit: false,
  },
  selectedWidgets: [],
  dashboardConfiguration: {
    viewport: { duration: '5m' },
    widgets: [],
  },
};
