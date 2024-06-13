import { DashboardState } from '~/store/state';
import { DashboardConfiguration } from '~/types';
import { parseViewport } from './parseViewport';

export const convertToDashboardConfiguration = ({
  grid,
  significantDigits,
  dashboardConfiguration,
}: DashboardState): DashboardConfiguration => ({
  displaySettings: {
    numColumns: grid.width,
    numRows: grid.height,
    cellSize: grid.cellSize,
    significantDigits,
  },
  ...dashboardConfiguration,
  defaultViewport: parseViewport(dashboardConfiguration.defaultViewport),
});
