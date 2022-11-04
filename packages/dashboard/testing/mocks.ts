/**
 * Shared mocks for testing purposes
 */
import { DashboardConfiguration, Widget } from '../src/types';

import {
  DEMO_TURBINE_ASSET_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_2,
  DEMO_TURBINE_ASSET_1_PROPERTY_3,
  DEMO_TURBINE_ASSET_1_PROPERTY_4,
  query,
} from './siteWiseQueries';

export const createMockWidget =
  (baseWidget: Widget) =>
  (partialWidget?: Partial<Widget>): Widget => ({
    ...baseWidget,
    ...partialWidget,
    id: partialWidget?.id ?? Math.random().toFixed(20),
  });

export const MOCK_KPI_WIDGET: Widget = {
  id: 'mock-kpi-widget',
  componentTag: 'iot-kpi',
  x: 0,
  y: 0,
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

export const MOCK_SCATTER_CHART_WIDGET: Widget = {
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

export const MOCK_LINE_CHART_WIDGET: Widget = {
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

export const MOCK_EMPTY_DASHBOARD: DashboardConfiguration = { viewport: { duration: '5m' }, widgets: [] };

export const createMockDashboard = (partialDashboard?: Partial<DashboardConfiguration>): DashboardConfiguration => ({
  ...MOCK_EMPTY_DASHBOARD,
  ...partialDashboard,
});

export const MockDashboardFactory = {
  get: createMockDashboard,
};

export const dashboardConfig: DashboardConfiguration = {
  viewport: { duration: '5m' },
  widgets: [MOCK_KPI_WIDGET],
};
