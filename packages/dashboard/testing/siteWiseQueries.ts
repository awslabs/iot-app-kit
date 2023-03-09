import { TimeSeriesData, Viewport } from '@iot-app-kit/core';
import { initialize, SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import noop from 'lodash/noop';
import { getEnvCredentials } from './getEnvCredentials';
import { generateMockTimeSeriesData } from './mocks';

const STRING_ASSET_ID = '';

export const DEMO_TURBINE_ASSET_1 = '';
export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = '';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = '';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = '';
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = '';

export const ASSET_DETAILS_QUERY = {
  assetId: STRING_ASSET_ID,
};

const AGGREGATED_DATA_ASSET = STRING_ASSET_ID;
const AGGREGATED_DATA_PROPERTY = '';
const AGGREGATED_DATA_PROPERTY_2 = '';

export const AGGREGATED_DATA_QUERY = {
  assets: [
    {
      assetId: AGGREGATED_DATA_ASSET,
      properties: [
        { propertyId: AGGREGATED_DATA_PROPERTY, resolution: '0', refId: 'testing' },
        { propertyId: AGGREGATED_DATA_PROPERTY_2 },
      ],
    },
  ],
};

export const query = (() => {
  try {
    return initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-east-1' }).query;
  } catch (e) {
    return initialize({
      awsCredentials: {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
      },
      awsRegion: 'us-west-2',
    }).query;
  }
})();

export const mockQuery = (
  timeSeriesData: TimeSeriesData[] = [generateMockTimeSeriesData()],
  overrides?: { updateViewport?: (viewport: Viewport) => void; unsubscribe?: () => void }
): SiteWiseQuery => {
  const { updateViewport = noop, unsubscribe = noop } = overrides || {};
  return {
    timeSeriesData: () => ({
      toQueryString: () => JSON.stringify(timeSeriesData),
      build: () => ({
        subscribe: ({ next }) => {
          next(timeSeriesData);
        },
        unsubscribe,
        updateViewport,
      }),
    }),
    assetTree: {
      fromRoot: () => ({
        toQueryString: () => '',
        build: () => ({
          subscribe: () => {},
          unsubscribe: () => {},
          expand: () => {},
          collapse: () => {},
        }),
      }),
      fromAsset: () => ({
        toQueryString: () => '',
        build: () => ({
          subscribe: () => {},
          unsubscribe: () => {},
          expand: () => {},
          collapse: () => {},
        }),
      }),
    },
  };
};

// From demo turbine asset, found at https://p-rlvy2rj8.app.iotsitewise.aws/
// These resources will eventually expire and need to be manually updated,
// because the demo turbine assets expire after 7 days.
