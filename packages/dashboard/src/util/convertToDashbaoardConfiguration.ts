import { type DashboardState } from '../store/state-old';
import { type DashboardConfiguration } from '../types';
import { parseViewport } from './parseViewport';

export const convertToDashboardConfiguration = ({
  grid,
  significantDigits,
  dashboardConfiguration,
}: DashboardState): DashboardConfiguration => {
  const config: DashboardConfiguration = {
    displaySettings: {
      numColumns: grid.width,
      numRows: grid.height,
      cellSize: grid.cellSize,
      significantDigits,
    },
    widgets: dashboardConfiguration.widgets,
  };
  if (dashboardConfiguration.defaultViewport) {
    config.defaultViewport = parseViewport(
      dashboardConfiguration.defaultViewport
    );
  }
  if (dashboardConfiguration.querySettings) {
    config.querySettings = dashboardConfiguration.querySettings;
  }
  return config;
};
