import { type DashboardState } from '~/store/state';
import type { DashboardConfiguration } from '~/features/dashboard-configuration/dashboard-configuration';
import { parseViewport } from './parseViewport';

export const convertToDashboardConfiguration = ({
  grid,
  decimalPlaces,
  dashboardConfiguration,
}: DashboardState): DashboardConfiguration => {
  const config: DashboardConfiguration = {
    displaySettings: {
      numColumns: grid.width,
      numRows: grid.height,
      cellSize: grid.cellSize,
      significantDigits: decimalPlaces,
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
