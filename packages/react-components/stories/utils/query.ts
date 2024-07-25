import { getIotEventsClient, getSiteWiseClient } from '@iot-app-kit/core-util';
import {
  SiteWiseDataStreamQuery,
  initialize,
} from '@iot-app-kit/source-iotsitewise';

export const getEnvCredentials = () => {
  if (
    process.env.AWS_ACCESS_KEY_ID == null ||
    process.env.AWS_SECRET_ACCESS_KEY == null
  ) {
    throw new Error(
      'Missing credentials: must provide the following env variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_SESSION_TOKEN within .env'
    );
  }
  return {
    // Provided by `.env` environment variable file
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  };
};

export const getRegion = () => {
  if (process.env.AWS_REGION == null) {
    throw new Error(
      'Missing credentials: Must provide the following env variables: AWS_REGION'
    );
  }
  return process.env.AWS_REGION;
};

const getAssetQuery = () => {
  if (
    process.env.ASSET_ID_1 == null ||
    process.env.PROPERTY_ID_1 == null ||
    process.env.PROPERTY_ID_2 == null ||
    process.env.PROPERTY_ID_3 == null
  ) {
    throw new Error(
      'Missing configuration: Must provide the following env variables: ASSET_ID_1. PROPERTY_ID_1. PROPERTY_ID_2 and PROPERTY_ID_3'
    );
  }
  return {
    assetId: process.env.ASSET_ID_1,
    propertyId1: process.env.PROPERTY_ID_1,
    propertyId2: process.env.PROPERTY_ID_2,
    propertyId3: process.env.PROPERTY_ID_3,
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

  const { assetId, propertyId1, propertyId2, propertyId3 } = getAssetQuery();

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
          {
            refId: '3',
            propertyId: propertyId3,
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

export const queryConfigured = () => {
  try {
    getEnvCredentials();
    getRegion();
    getAssetQuery();
  } catch (e) {
    return false;
  }
  return true;
};
