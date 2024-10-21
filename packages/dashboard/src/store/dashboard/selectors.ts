import { createDeepStoreSelector, createStoreSelector } from '../selectors';

export const selectDashboardConfiguration = createStoreSelector(
  [(state) => state.dashboard.present.dashboardConfiguration],
  (dashboardConfiguration) => dashboardConfiguration
);

export const selectWidgets = createDeepStoreSelector(
  [(state) => state.dashboard.present.dashboardConfiguration.widgets],
  (widgets) => widgets
);

export const selectDashboardCellSize = createStoreSelector(
  [
    (state) =>
      state.dashboard.present.dashboardConfiguration.displaySettings.cellSize,
  ],
  (cellSize) => cellSize
);

export const selectDashboardHeight = createStoreSelector(
  [
    (state) =>
      state.dashboard.present.dashboardConfiguration.displaySettings.numRows,
  ],
  (numRows) => numRows
);

export const selectDashboardWidth = createStoreSelector(
  [
    (state) =>
      state.dashboard.present.dashboardConfiguration.displaySettings.numColumns,
  ],
  (numColumns) => numColumns
);

export const selectDashboardRefreshRate = createStoreSelector(
  [
    (state) =>
      state.dashboard.present.dashboardConfiguration.querySettings.refreshRate,
  ],
  (refreshRate) => refreshRate
);
