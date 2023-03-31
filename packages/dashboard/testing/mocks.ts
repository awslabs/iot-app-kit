import type { DataPoint, TimeSeriesData } from '@iot-app-kit/core';
import { DATA_TYPE } from '@iot-app-kit/core';
import random from 'lodash/random';
import {
  KPIWidget,
  LineChartWidget,
  ScatterChartWidget,
  StatusWidget,
  TextWidget,
} from '~/customization/widgets/types';
/**
 * Shared mocks for testing purposes
 */
import { DashboardWidgetsConfiguration, DashboardWidget } from '../src/types';

import {
  DEMO_TURBINE_ASSET_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_2,
  DEMO_TURBINE_ASSET_1_PROPERTY_3,
  DEMO_TURBINE_ASSET_1_PROPERTY_4,
} from './siteWiseQueries';

export const createMockWidget =
  (baseWidget: DashboardWidget) =>
  (partialWidget?: Partial<DashboardWidget>): DashboardWidget => ({
    ...baseWidget,
    ...partialWidget,
    id: partialWidget?.id ?? Math.random().toFixed(20),
  });

export const MOCK_KPI_WIDGET: KPIWidget = {
  id: 'mock-kpi-widget',
  type: 'iot-kpi',
  x: 0,
  y: 0,
  z: 1,
  width: 8,
  height: 5,
  properties: {
    queryConfig: {
      source: 'iotsitewise',
      query: {
        assets: [
          {
            assetId: DEMO_TURBINE_ASSET_1,
            properties: [{ resolution: '0', propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_4 }],
          },
        ],
      },
    },
    primaryFont: {},
    secondaryFont: {},
  },
};

export const MOCK_SCATTER_CHART_WIDGET: ScatterChartWidget = {
  id: 'mock-scatter-chart-widget',
  type: 'iot-scatter',
  x: 2,
  y: 2,
  z: 1,
  width: 8,
  height: 5,
  properties: {
    queryConfig: {
      source: 'iotsitewise',
      query: {
        assets: [
          {
            assetId: DEMO_TURBINE_ASSET_1,
            properties: [{ resolution: '0', propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 }],
          },
        ],
      },
    },
  },
};

export const MOCK_LINE_CHART_WIDGET: LineChartWidget = {
  id: 'mock-line-chart-widget',
  type: 'iot-line',
  x: 2,
  y: 2,
  z: 1,
  width: 8,
  height: 5,
  properties: {
    queryConfig: {
      source: 'iotsitewise',
      query: {
        assets: [
          {
            assetId: DEMO_TURBINE_ASSET_1,
            properties: [
              { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 },
              { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 },
            ],
          },
        ],
      },
    },
  },
};

export const MOCK_STATUS_TIMELINE_WIDGET: StatusWidget = {
  id: 'mock-status-timeline-widget',
  type: 'iot-status',
  x: 2,
  y: 2,
  z: 1,
  width: 8,
  height: 5,
  properties: {
    queryConfig: {
      source: 'iotsitewise',
      query: {
        assets: [
          {
            assetId: DEMO_TURBINE_ASSET_1,
            properties: [
              { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 },
              { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 },
            ],
          },
        ],
      },
    },
    primaryFont: {},
    secondaryFont: {},
  },
};

export const MOCK_TEXT_WIDGET: TextWidget = {
  id: 'mock-text-widget',
  type: 'text',
  x: 0,
  y: 0,
  z: 1,
  width: 8,
  height: 5,
  properties: {
    value: 'text content',
  },
};

export const MOCK_TEXT_LINK_WIDGET: TextWidget = {
  id: 'mock-text-widget',
  type: 'text',
  x: 0,
  y: 0,
  z: 1,
  width: 8,
  height: 5,
  properties: {
    value: 'text content',
    href: 'some-link.link',
    isUrl: true,
  },
};

export const MockWidgetFactory = {
  getKpiWidget: createMockWidget(MOCK_KPI_WIDGET),
  getScatterChartWidget: createMockWidget(MOCK_SCATTER_CHART_WIDGET),
  getLineChartWidget: createMockWidget(MOCK_LINE_CHART_WIDGET),
  getStatusTimelineWidget: createMockWidget(MOCK_STATUS_TIMELINE_WIDGET),
  getTextWidget: createMockWidget(MOCK_TEXT_WIDGET),
};

export const getRandomWidget = (partialWidget?: Partial<DashboardWidget>): DashboardWidget => {
  switch (random(0, 3)) {
    default:
    case 0:
      return MockWidgetFactory.getKpiWidget({ height: 10, width: 30, ...partialWidget });
    case 1:
      return MockWidgetFactory.getScatterChartWidget({ height: 20, width: 30, ...partialWidget });
    case 2:
      return MockWidgetFactory.getLineChartWidget({ height: 20, width: 30, ...partialWidget });
    case 3:
      return MockWidgetFactory.getStatusTimelineWidget({ height: 20, width: 30, ...partialWidget });
  }
};

export const MOCK_EMPTY_DASHBOARD: DashboardWidgetsConfiguration = { viewport: { duration: '5m' }, widgets: [] };

export const createMockDashboard = (
  partialDashboard?: Partial<DashboardWidgetsConfiguration>
): DashboardWidgetsConfiguration => ({
  ...MOCK_EMPTY_DASHBOARD,
  ...partialDashboard,
});

export const MockDashboardFactory = {
  get: createMockDashboard,
};

export const dashboardConfig: DashboardWidgetsConfiguration = {
  viewport: { duration: '5m' },
  widgets: [MOCK_KPI_WIDGET],
};

export const generateMockTimeSeriesData = (): TimeSeriesData => {
  const end = new Date('2020-05-12T20:50:21.817Z').getTime();
  const start = end - 1000 * 60 * 60;

  const dataPoint1: DataPoint<number> = {
    x: start,
    y: 1000,
  };

  const dataPoint2: DataPoint<number> = {
    x: end,
    y: 2000,
  };

  return {
    dataStreams: [
      {
        id: 'test',
        color: 'black',
        name: 'test stream',
        data: [dataPoint1, dataPoint2],
        resolution: 0,
        dataType: DATA_TYPE.NUMBER,
      },
    ],
    viewport: { start: new Date(start), end: new Date(end) },
    thresholds: [],
  };
};
