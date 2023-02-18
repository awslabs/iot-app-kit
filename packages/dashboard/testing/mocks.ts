import { TimeSeriesData } from '@iot-app-kit/core';
import { DataPoint, DataType } from '@synchro-charts/core';
import random from 'lodash/random';
import {
  DescribeAssetResponse,
  DescribeAssetPropertyResponse,
  ListTagsForResourceResponse,
  BatchPutAssetPropertyValueResponse,
  AssetProperty,
} from '@aws-sdk/client-iotsitewise';
import { WRITABLE_TAG } from '~/components/widgets/primitives/input/hooks/useWritableSiteWiseProperty';
/**
 * Shared mocks for testing purposes
 */
import { AppKitWidget, DashboardConfiguration, TextWidget, Widget, InputWidget } from '~/types';

import {
  DEMO_TURBINE_ASSET_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_1,
  DEMO_TURBINE_ASSET_1_PROPERTY_2,
  DEMO_TURBINE_ASSET_1_PROPERTY_3,
  DEMO_TURBINE_ASSET_1_PROPERTY_4,
} from './siteWiseQueries';

export const createMockWidget =
  (baseWidget: Widget) =>
  (partialWidget?: Partial<Widget>): Widget => ({
    ...baseWidget,
    ...partialWidget,
    id: partialWidget?.id ?? Math.random().toFixed(20),
  });

export const MOCK_KPI_WIDGET: AppKitWidget = {
  id: 'mock-kpi-widget',
  widgetId: 'mock-kpi-widget',
  componentTag: 'iot-kpi',
  x: 0,
  y: 0,
  z: 1,
  width: 8,
  height: 5,
  assets: [
    {
      assetId: DEMO_TURBINE_ASSET_1,
      properties: [{ resolution: '0', propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_4 }],
    },
  ],
};

export const MOCK_SCATTER_CHART_WIDGET: AppKitWidget = {
  id: 'mock-scatter-chart-widget',
  widgetId: 'mock-scatter-chart-widget',
  componentTag: 'iot-scatter-chart',
  x: 2,
  y: 2,
  z: 1,
  width: 8,
  height: 5,
  assets: [
    {
      assetId: DEMO_TURBINE_ASSET_1,
      properties: [{ resolution: '0', propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_3 }],
    },
  ],
};

export const MOCK_LINE_CHART_WIDGET: AppKitWidget = {
  id: 'mock-line-chart-widget',
  widgetId: 'mock-line-chart-widget',
  componentTag: 'iot-line-chart',
  x: 2,
  y: 2,
  z: 1,
  width: 8,
  height: 5,
  assets: [
    {
      assetId: DEMO_TURBINE_ASSET_1,
      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 }, { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }],
    },
  ],
};

export const MOCK_STATUS_TIMELINE_WIDGET: AppKitWidget = {
  id: 'mock-status-timeline-widget',
  widgetId: 'mock-status-timeline-widget',
  componentTag: 'iot-status-timeline',
  x: 2,
  y: 2,
  z: 1,
  width: 8,
  height: 5,
  assets: [
    {
      assetId: DEMO_TURBINE_ASSET_1,
      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_2 }, { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }],
    },
  ],
};

export const MOCK_TEXT_WIDGET: TextWidget = {
  id: 'mock-text-widget',
  componentTag: 'text',
  x: 0,
  y: 0,
  z: 1,
  width: 8,
  height: 5,
  text: 'text content',
};

export const MOCK_INPUT_WIDGET: InputWidget = {
  id: 'mock-input-widget',
  componentTag: 'input',
  x: 0,
  y: 0,
  z: 1,
  width: 30,
  height: 5,
  properties: {
    options: [{ label: 'Going to lunch' }, { label: 'Company event' }, { label: 'Taking training' }],
  },
};

export const MockWidgetFactory = {
  getKpiWidget: createMockWidget(MOCK_KPI_WIDGET),
  getScatterChartWidget: createMockWidget(MOCK_SCATTER_CHART_WIDGET),
  getLineChartWidget: createMockWidget(MOCK_LINE_CHART_WIDGET),
  getStatusTimelineWidget: createMockWidget(MOCK_STATUS_TIMELINE_WIDGET),
  getTextWidget: createMockWidget(MOCK_TEXT_WIDGET),
};

export const getRandomWidget = (partialWidget?: Partial<Widget>): Widget => {
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
        dataType: DataType.NUMBER,
      },
    ],
    viewport: { start: new Date(start).toISOString(), end: new Date(end).toISOString() },
    annotations: {},
  };
};

export const STRING_ASSET_PROPERTY: AssetProperty = {
  alias: 'logs',
  dataType: 'STRING',
  id: '20d0c2bd-d4f7-4642-93ab-1aec642b645d',
  name: 'LOGSTREAM',
  notification: {
    state: 'DISABLED',
    topic:
      '$aws/sitewise/asset-models/5ab18893-c34c-4b28-bd04-ca4489b8b8f5/assets/62d5e3ed-9f27-4fd7-aaea-1ba1e0a3a33b/properties/20d0c2bd-d4f7-4642-93ab-1aec642b645d',
  },
};

export const NON_STRING_ASSET_PROPERTY: AssetProperty = {
  alias: 'non string log',
  dataType: 'INTEGER',
  id: 'a884e34f-0ae5-41a8-bf1e-03594077cc8b',
  name: 'nonstringlog',
  notification: {
    state: 'DISABLED',
    topic:
      '$aws/sitewise/asset-models/5ab18893-c34c-4b28-bd04-ca4489b8b8f5/assets/62d5e3ed-9f27-4fd7-aaea-1ba1e0a3a33b/properties/a884e34f-0ae5-41a8-bf1e-03594077cc8b',
  },
};

export const DESCRIBE_ASSET_RESPONSE: DescribeAssetResponse = {
  assetArn: 'arn:aws:iotsitewise:us-east-2:111111111111:asset/62d5e3ed-9f27-4fd7-aaea-1ba1e0a3a33b',
  assetCompositeModels: [],
  assetCreationDate: new Date(),
  assetHierarchies: [],
  assetId: '62d5e3ed-9f27-4fd7-aaea-1ba1e0a3a33b',
  assetLastUpdateDate: new Date(),
  assetModelId: '5ab18893-c34c-4b28-bd04-ca4489b8b8f5',
  assetName: 'LOGS',
  assetProperties: [STRING_ASSET_PROPERTY, NON_STRING_ASSET_PROPERTY],
  assetStatus: {
    state: 'ACTIVE',
  },
};

export const DESCRIBE_ASSET_PROPERTY_RESPONSE: DescribeAssetPropertyResponse = {
  assetId: '62d5e3ed-9f27-4fd7-aaea-1ba1e0a3a33b',
  assetModelId: '5ab18893-c34c-4b28-bd04-ca4489b8b8f5',
  assetName: 'LOGS',
  assetProperty: {
    alias: 'logs',
    dataType: 'STRING',
    id: '20d0c2bd-d4f7-4642-93ab-1aec642b645d',
    name: 'LOGSTREAM',
    notification: {
      state: 'DISABLED',
      topic:
        '$aws/sitewise/asset-models/5ab18893-c34c-4b28-bd04-ca4489b8b8f5/assets/62d5e3ed-9f27-4fd7-aaea-1ba1e0a3a33b/properties/20d0c2bd-d4f7-4642-93ab-1aec642b645d',
    },
    type: {
      measurement: {},
    },
  },
};

export const LIST_TAGS_FOR_RESOURCE_RESPONSE: ListTagsForResourceResponse = {
  tags: {
    [WRITABLE_TAG]: '',
  },
};

export const BATCH_PUT_ASSET_PROPERTY_VALUE_RESPONSE: BatchPutAssetPropertyValueResponse = {
  errorEntries: [],
};
