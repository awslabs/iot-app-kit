import { getIotEventsClient, getSiteWiseClient } from '@iot-app-kit/core-util';
import {
  type SiteWiseAlarmDataStreamQuery,
  type SiteWiseDataStreamQuery,
  initialize,
} from '@iot-app-kit/source-iotsitewise';

export const getEnvCredentials = () => {
  if (
    import.meta.env.VITE_AWS_ACCESS_KEY_ID == null ||
    import.meta.env.VITE_AWS_SECRET_ACCESS_KEY == null
  ) {
    throw new Error(
      'Missing credentials: must provide the following env variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_SESSION_TOKEN within .env'
    );
  }
  return {
    // Provided by `.env` environment variable file
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
  };
};

export const getRegion = () => {
  if (import.meta.env.VITE_AWS_REGION == null) {
    throw new Error(
      'Missing credentials: Must provide the following env variables: AWS_REGION'
    );
  }
  return import.meta.env.VITE_AWS_REGION;
};

const getAssetQuery = () => {
  if (
    import.meta.env.VITE_ASSET_ID_1 == null ||
    import.meta.env.VITE_PROPERTY_ID_1 == null ||
    import.meta.env.VITE_PROPERTY_ID_2 == null ||
    import.meta.env.VITE_PROPERTY_ID_3 == null
  ) {
    throw new Error(
      'Missing configuration: Must provide the following env variables: ASSET_ID_1. PROPERTY_ID_1. PROPERTY_ID_2 and PROPERTY_ID_3'
    );
  }
  return {
    assetId: import.meta.env.VITE_ASSET_ID_1,
    propertyId1: import.meta.env.VITE_PROPERTY_ID_1,
    propertyId2: import.meta.env.VITE_PROPERTY_ID_2,
    propertyId3: import.meta.env.VITE_PROPERTY_ID_3,
  };
};

export const getIotSiteWiseQuery = () => {
  const clientConfiguration = {
    awsCredentials: getEnvCredentials(),
    awsRegion: getRegion(),
  };
  return initialize({
    iotSiteWiseClient: getSiteWiseClient(clientConfiguration),
    iotEventsClient: getIotEventsClient(clientConfiguration),
  }).query;
};

export const getTimeSeriesDataQuery = (
  dataStreamQuery?: SiteWiseDataStreamQuery
) => {
  if (dataStreamQuery) {
    return getIotSiteWiseQuery().timeSeriesData(dataStreamQuery);
  }

  const { assetId, propertyId1, propertyId2 } = getAssetQuery();

  return getIotSiteWiseQuery().timeSeriesData({
    assets: [
      {
        assetId,
        properties: [
          {
            refId: '1',
            propertyId: propertyId1,
            aggregationType: 'AVERAGE',
            resolution: '1m',
          },
          {
            refId: '2',
            propertyId: propertyId2,
            aggregationType: 'AVERAGE',
            resolution: '1m',
          },
        ],
      },
    ],
  });
};

export const getSingleValueTimeSeriesDataQuery = (
  dataStreamQuery?: SiteWiseDataStreamQuery
) => {
  if (dataStreamQuery) {
    return getIotSiteWiseQuery().timeSeriesData(dataStreamQuery);
  }

  const { assetId, propertyId1 } = getAssetQuery();

  return getIotSiteWiseQuery().timeSeriesData({
    assets: [
      {
        assetId,
        properties: [
          {
            refId: '1',
            propertyId: propertyId1,
            aggregationType: 'AVERAGE',
            resolution: '1m',
          },
        ],
      },
    ],
  });
};

export const getSingleValueAlarmDataQuery = (
  alarmStreamQuery?: SiteWiseAlarmDataStreamQuery
) => {
  if (alarmStreamQuery) {
    return getIotSiteWiseQuery().alarmData(alarmStreamQuery);
  }

  const { assetId } = getAssetQuery();
  const alarmId1 = import.meta.env.VITE_ALARM_COMPOSITE_MODEL_ID_1;

  if (!alarmId1) return getIotSiteWiseQuery().alarmData({});

  return getIotSiteWiseQuery().alarmData({
    alarms: [
      {
        assetId: assetId,
        alarmComponents: [
          {
            assetCompositeModelId: alarmId1,
          },
        ],
      },
    ],
    requestSettings: {
      refreshRate: 5000,
    },
  });
};

export const queryConfigured = () => {
  try {
    console.log(import.meta.env);
    getEnvCredentials();
    getRegion();
    getAssetQuery();
  } catch (e) {
    return false;
  }
  return true;
};
