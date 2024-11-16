import { type TimeSeriesData, type Viewport } from '@iot-app-kit/core';
import {
  initialize,
  type SiteWiseQuery,
} from '@iot-app-kit/source-iotsitewise';
import {
  createMockIoTEventsSDK,
  createMockSiteWiseSDK,
} from '@iot-app-kit/testing-util';
import noop from 'lodash/noop';
import { getEnvCredentials } from './getEnvCredentials';
import { generateMockTimeSeriesData } from './mocks';
import { TEST_REGION } from './constants';

export const REGION = TEST_REGION;

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
        {
          propertyId: AGGREGATED_DATA_PROPERTY,
          resolution: '0',
          refId: 'testing',
        },
        { propertyId: AGGREGATED_DATA_PROPERTY_2 },
      ],
    },
  ],
};

export const query = (() => {
  try {
    return initialize({
      awsCredentials: getEnvCredentials(),
      awsRegion: REGION,
    }).query;
  } catch (e) {
    return initialize({
      awsCredentials: {
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey',
      },
      awsRegion: REGION,
    }).query;
  }
})();

export const mockQuery = (
  timeSeriesData: TimeSeriesData[] = [generateMockTimeSeriesData()],
  overrides?: {
    updateViewport?: (viewport: Viewport) => void;
    unsubscribe?: () => void;
  }
): SiteWiseQuery => {
  const { updateViewport = noop, unsubscribe = noop } = overrides || {};
  const timeSeriesDataFn: SiteWiseQuery['timeSeriesData'] = (_query) => ({
    toQueryString: () => JSON.stringify(timeSeriesData),
    build: () => ({
      subscribe: ({ next }) => {
        next(timeSeriesData);
      },
      unsubscribe,
      updateViewport,
    }),
  });
  return {
    fetchTimeSeriesData: (_input) => new Promise(() => {}),
    timeSeriesData: timeSeriesDataFn,
    anomalyData: (query) => ({
      query,
      iotSiteWiseClient: createMockSiteWiseSDK(),
    }),
    alarmData: (query) => ({
      query,
      iotSiteWiseClient: createMockSiteWiseSDK(),
      iotEventsClient: createMockIoTEventsSDK(),
      timeSeriesData: timeSeriesDataFn,
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
