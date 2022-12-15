import { DashboardConfiguration, Widget } from '../types';

export type DashboardState = {
  grid: {
    enabled: boolean;
    width: number;
    height: number;
    cellSize: number;
    stretchToFit: boolean;
  };
  readonly: boolean;
  selectedWidgets: Widget[];
  copiedWidgets: Widget[];
  pasteCounter: number;
  dashboardConfiguration: DashboardConfiguration;
};

export const initialState: DashboardState = {
  grid: {
    enabled: true,
    width: 100,
    height: 100,
    cellSize: 10,
    stretchToFit: false,
  },
  readonly: false,
  selectedWidgets: [],
  copiedWidgets: [],
  pasteCounter: 0,
  dashboardConfiguration: {
    viewport: { duration: '5m' },
    widgets: [],
  },
};
