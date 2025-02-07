import {
  type IoTSiteWiseClient,
  type PropertyDataType,
  Quality,
} from '@aws-sdk/client-iotsitewise';
import { type DataStream, type DataType } from '@iot-app-kit/core';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';
import type {
  StyledAssetQuery,
  StyledSiteWiseQueryConfig,
} from '~/plugins/xy-plot/types';
import { convertToCSVObject } from './convertToCSVObject';

const ASSET_ID_1 = 'some-asset-id-1';
const PROPERTY_ID_1 = 'some-property-id-1';

it('returns empty CSV Object array with error for failed DataStream', async () => {
  const MOCK_DATA_STREAM_1: DataStream = {
    data: [],
    unit: 'MPH',
    aggregationType: 'AVERAGE',
    resolution: 86000,
    name: 'Average Wind Speed',
    id: `${ASSET_ID_1}---${PROPERTY_ID_1}`,
    error: { msg: 'failure' },
    dataType: 'DOUBLE' as DataType,
  };

  const MOCK_QUERY: StyledAssetQuery = {
    assets: [
      { assetId: ASSET_ID_1, properties: [{ propertyId: PROPERTY_ID_1 }] },
    ],
  };

  const MOCK_QUERY_CONFIG: StyledSiteWiseQueryConfig = {
    source: 'iotsitewise',
    query: {
      ...MOCK_QUERY,
    },
  };

  const { data, hasError } = await convertToCSVObject({
    client: createMockSiteWiseSDK() as unknown as IoTSiteWiseClient,
    dataStreams: [MOCK_DATA_STREAM_1],
    viewport: { start: new Date(999324000000), end: new Date(999496800000) },
    queryConfig: MOCK_QUERY_CONFIG,
    listAssetPropertiesMap: {},
  });

  expect({ data, hasError }).toEqual({
    data: [],
    hasError: true,
  });
});

it('returns correct CSV Object array for succesful DataStream', async () => {
  const MOCK_DATA_STREAM_1: DataStream = {
    data: [{ x: 999325000000, y: 123.89 }],
    unit: 'MPH',
    aggregationType: 'AVERAGE',
    resolution: 86000,
    name: 'Average Wind Speed',
    id: `${ASSET_ID_1}---${PROPERTY_ID_1}`,
    dataType: 'DOUBLE' as DataType,
  };

  const MOCK_LIST_ASSET_PROPS = {
    [ASSET_ID_1]: {
      assetName: 'ASSET NAME 1',
      assetId: ASSET_ID_1,
      alarms: [],
      properties: [
        {
          propertyId: PROPERTY_ID_1,
          dataType: MOCK_DATA_STREAM_1.dataType as PropertyDataType,
          name: MOCK_DATA_STREAM_1.name,
          unit: MOCK_DATA_STREAM_1.unit,
          alias: undefined,
        },
      ],
    },
  };

  const MOCK_CSV_OBJECT_1 = {
    value: 123.89,
    unit: MOCK_DATA_STREAM_1.unit,
    timestamp: new Date(999325000000).toISOString(),
    aggregationType: MOCK_DATA_STREAM_1.aggregationType,
    assetName: MOCK_LIST_ASSET_PROPS[ASSET_ID_1].assetName,
    propertyAlias: undefined,
    dataQuality: Quality.GOOD,
    resolution: MOCK_DATA_STREAM_1.resolution,
    propertyName: MOCK_DATA_STREAM_1.name,
    dataType: MOCK_DATA_STREAM_1.dataType,
    dataTypeSpec: undefined,
    assetId: ASSET_ID_1,
    propertyId: PROPERTY_ID_1,
  };

  const MOCK_QUERY: StyledAssetQuery = {
    assets: [
      { assetId: ASSET_ID_1, properties: [{ propertyId: PROPERTY_ID_1 }] },
    ],
  };

  const MOCK_QUERY_CONFIG: StyledSiteWiseQueryConfig = {
    source: 'iotsitewise',
    query: {
      ...MOCK_QUERY,
    },
  };

  const { data, hasError } = await convertToCSVObject({
    client: createMockSiteWiseSDK() as unknown as IoTSiteWiseClient,
    dataStreams: [MOCK_DATA_STREAM_1],
    viewport: { start: new Date(999324000000), end: new Date(999496800000) },
    queryConfig: MOCK_QUERY_CONFIG,
    listAssetPropertiesMap: MOCK_LIST_ASSET_PROPS,
  });

  expect({ data, hasError }).toEqual({
    data: [MOCK_CSV_OBJECT_1],
    hasError: false,
  });
});

it('returns empty CSV Object array with no error for empty dataSTream', async () => {
  const MOCK_QUERY: StyledAssetQuery = {
    assets: [
      { assetId: ASSET_ID_1, properties: [{ propertyId: PROPERTY_ID_1 }] },
    ],
  };

  const MOCK_QUERY_CONFIG: StyledSiteWiseQueryConfig = {
    source: 'iotsitewise',
    query: {
      ...MOCK_QUERY,
    },
  };

  const { data, hasError } = await convertToCSVObject({
    client: createMockSiteWiseSDK() as unknown as IoTSiteWiseClient,
    dataStreams: [],
    viewport: { start: new Date(999324000000), end: new Date(999496800000) },
    queryConfig: MOCK_QUERY_CONFIG,
    listAssetPropertiesMap: {},
  });

  expect({ data, hasError }).toEqual({
    data: [],
    hasError: false,
  });
});

it('returns empty CSV Object array with no error for empty query', async () => {
  const MOCK_QUERY: StyledAssetQuery = {};

  const MOCK_QUERY_CONFIG: StyledSiteWiseQueryConfig = {
    source: 'iotsitewise',
    query: {
      ...MOCK_QUERY,
    },
  };

  const { data, hasError } = await convertToCSVObject({
    client: createMockSiteWiseSDK() as unknown as IoTSiteWiseClient,
    dataStreams: [],
    viewport: { start: new Date(999324000000), end: new Date(999496800000) },
    queryConfig: MOCK_QUERY_CONFIG,
    listAssetPropertiesMap: {},
  });

  expect({ data, hasError }).toEqual({
    data: [],
    hasError: false,
  });
});
