import {
  DEMO_TURBINE_ASSET_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_2,
  DEMO_TURBINE_ASSET_1_PROPERTY_3,
  DEMO_TURBINE_ASSET_1_PROPERTY_4,
  query,
} from './siteWiseQueries';
export const createMockWidget = (baseWidget) => (partialWidget) => {
  var _a;
  return Object.assign(Object.assign(Object.assign({}, baseWidget), partialWidget), {
    id:
      (_a = partialWidget === null || partialWidget === void 0 ? void 0 : partialWidget.id) !== null && _a !== void 0
        ? _a
        : Math.random().toFixed(20),
  });
};
export const MOCK_KPI_WIDGET = {
  id: 'mock-kpi-widget',
  componentTag: 'iot-kpi',
  x: 2,
  y: 2,
  z: 1,
  width: 8,
  height: 5,
  queries: [
    query.timeSeriesData({
      assets: [
        {
          assetId: DEMO_TURBINE_ASSET_1,
          properties: [{ resolution: '0', propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_4 }],
        },
      ],
    }),
  ],
};
export const MOCK_SCATTER_CHART_WIDGET = {
  id: 'mock-scatter-chart-widget',
  componentTag: 'iot-scatter-chart',
  x: 2,
  y: 2,
  z: 1,
  width: 8,
  height: 5,
  queries: [
    query.timeSeriesData({
      assets: [
        {
          assetId: DEMO_TURBINE_ASSET_1,
          properties: [{ resolution: '0', propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 }],
        },
      ],
    }),
  ],
};
export const MOCK_LINE_CHART_WIDGET = {
  id: 'mock-line-chart-widget',
  componentTag: 'iot-line-chart',
  x: 2,
  y: 2,
  z: 1,
  width: 8,
  height: 5,
  queries: [
    query.timeSeriesData({
      assets: [
        {
          assetId: DEMO_TURBINE_ASSET_1,
          properties: [
            { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 },
            { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 },
          ],
        },
      ],
    }),
  ],
};
export const MockWidgetFactory = {
  getKpiWidget: createMockWidget(MOCK_KPI_WIDGET),
  getScatterChartWidget: createMockWidget(MOCK_SCATTER_CHART_WIDGET),
  getLineChartWidget: createMockWidget(MOCK_LINE_CHART_WIDGET),
};
export const MOCK_EMPTY_DASHBOARD = { viewport: { duration: '5m' }, widgets: [] };
export const createMockDashboard = (partialDashboard) =>
  Object.assign(Object.assign({}, MOCK_EMPTY_DASHBOARD), partialDashboard);
export const MockDashboardFactory = {
  get: createMockDashboard,
};
export const dashboardConfig = {
  viewport: { duration: '5m' },
  widgets: [MOCK_KPI_WIDGET],
};
