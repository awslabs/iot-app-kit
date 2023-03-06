import { getTableDefinitions } from './helper';
import { SiteWiseAssetQuery, toId } from '@iot-app-kit/source-iotsitewise';
import { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';
import { ColumnDefinition, Item } from '@iot-app-kit/table';

const MOCK_ASSET_QUERY: SiteWiseAssetQuery = {
  assets: [
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
  ],
};
const MOCK_DESCRIPTION_MAP: Record<string, DescribeAssetResponse> = {
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

it('should return column definitions and items', () => {
  const { columnDefinitions, items } = getTableDefinitions(MOCK_ASSET_QUERY, MOCK_DESCRIPTION_MAP);
  expect(columnDefinitions).toEqual(COL_DEFS);
  expect(items).toEqual(ITEMS);
});

it('should return column definitions and items when describeAsset map does not exist', () => {
  const { columnDefinitions, items } = getTableDefinitions(MOCK_ASSET_QUERY, {});
  expect(columnDefinitions).toMatchObject([
    {
      key: 'mock-property-id-1',
      header: 'mock-property-id-1',
    },
    {
      key: 'mock-property-id-2',
      header: 'mock-property-id-2',
    },
    {
      key: 'mock-property-id-3',
      header: 'mock-property-id-3',
    },
  ]);
  expect(items).toMatchObject([
    {
      'mock-property-id-1': {
        $cellRef: {
          id: toId({ assetId: 'mock-asset-id-1', propertyId: 'mock-property-id-1' }),
          resolution: 0,
        },
      },
      'mock-property-id-2': {
        $cellRef: {
          id: toId({ assetId: 'mock-asset-id-1', propertyId: 'mock-property-id-2' }),
          resolution: 0,
        },
      },
    },
    {
      'mock-property-id-2': {
        $cellRef: {
          id: toId({ assetId: 'mock-asset-id-2', propertyId: 'mock-property-id-2' }),
          resolution: 0,
        },
      },
      'mock-property-id-3': {
        $cellRef: {
          id: toId({ assetId: 'mock-asset-id-2', propertyId: 'mock-property-id-3' }),
          resolution: 0,
        },
      },
    },
  ]);
});
