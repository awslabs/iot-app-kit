import { AppKitWidget, Widget } from '~/types';
import { DashboardState, initialState } from '~/store/state';
import { MOCK_KPI_WIDGET } from '../../../../testing/mocks';
import { onUpdateTableAssets, updateTableAssets } from '~/store/actions/updateTableWidget/index';
import { AssetQuery } from '@iot-app-kit/core';
import { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';
import { toId } from '@iot-app-kit/source-iotsitewise';
import { ColumnDefinition, Item } from '@iot-app-kit/table';

const MOCK_TABLE_WIDGET: AppKitWidget = {
  height: 0,
  widgetId: 'mock-table-widget',
  width: 0,
  x: 0,
  y: 0,
  z: 0,
  id: 'table-widget',
  componentTag: 'iot-table',
};
const MOCK_ASSET_QUERY: AssetQuery[] = [
  {
    assetId: 'mock-asset-id-1',
    properties: [
      {
        propertyId: 'mock-property-id-1',
      },
      {
        propertyId: 'mock-property-id-2',
      },
    ],
  },
  {
    assetId: 'mock-asset-id-2',
    properties: [
      {
        propertyId: 'mock-property-id-2',
      },
      {
        propertyId: 'mock-property-id-3',
      },
    ],
  },
];

const MOCK_DESCRIPTION_MAP: DashboardState['assetsDescriptionMap'] = {
  'mock-asset-id-1': {
    assetId: 'mock-asset-id-1',
    assetName: 'mock-asset-name',
    assetProperties: [
      {
        id: 'mock-property-id-1',
        name: 'Property 1',
        dataType: 'DOUBLE',
      },
      {
        id: 'mock-property-id-2',
        name: 'Property 2',
        dataType: 'DOUBLE',
      },
    ],
  } as DescribeAssetResponse,
  'mock-asset-id-2': {
    assetId: 'mock-asset-id-2',
    assetName: 'mock-asset-name',
    assetProperties: [
      { id: 'mock-property-id-2', name: 'Property 2', dataType: 'DOUBLE' },
      { id: 'mock-property-id-3', name: 'Property 3', dataType: 'DOUBLE' },
    ],
  } as DescribeAssetResponse,
};

const COL_DEFS: ColumnDefinition[] = [
  {
    key: 'Property 1',
    header: 'Property 1',
  },
  {
    key: 'Property 2',
    header: 'Property 2',
  },
  {
    key: 'Property 3',
    header: 'Property 3',
  },
];

const ITEMS: Item[] = [
  {
    'Property 1': {
      $cellRef: {
        id: toId({ assetId: 'mock-asset-id-1', propertyId: 'mock-property-id-1' }),
        resolution: 0,
      },
    },
    'Property 2': {
      $cellRef: {
        id: toId({ assetId: 'mock-asset-id-1', propertyId: 'mock-property-id-2' }),
        resolution: 0,
      },
    },
  },
  {
    'Property 2': {
      $cellRef: {
        id: toId({ assetId: 'mock-asset-id-2', propertyId: 'mock-property-id-2' }),
        resolution: 0,
      },
    },
    'Property 3': {
      $cellRef: {
        id: toId({ assetId: 'mock-asset-id-2', propertyId: 'mock-property-id-3' }),
        resolution: 0,
      },
    },
  },
];
const setupDashboardState = (
  widgets: Widget[] = [],
  assetsDescriptionMap: DashboardState['assetsDescriptionMap'] = MOCK_DESCRIPTION_MAP
): DashboardState => ({
  ...initialState,
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
  assetsDescriptionMap,
});
it('should does nothing on widget other than table', () => {
  const state = setupDashboardState([MOCK_KPI_WIDGET]);
  expect(
    updateTableAssets(
      state,
      onUpdateTableAssets({
        widget: MOCK_KPI_WIDGET,
        assetQuery: MOCK_ASSET_QUERY,
      })
    )
  ).toEqual(state);
});
it('should create item and column definitions', () => {
  const state = setupDashboardState([MOCK_TABLE_WIDGET]);
  const widget = updateTableAssets(
    state,
    onUpdateTableAssets({
      widget: MOCK_TABLE_WIDGET,
      assetQuery: MOCK_ASSET_QUERY,
    })
  ).dashboardConfiguration.widgets[0];
  expect(widget).toMatchObject({
    ...MOCK_TABLE_WIDGET,
    items: ITEMS,
    columnDefinitions: COL_DEFS,
  });
});
