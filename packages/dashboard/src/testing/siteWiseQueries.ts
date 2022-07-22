import { initialize } from '@iot-app-kit/source-iotsitewise';
import { getEnvCredentials } from './getEnvCredentials';

const STRING_ASSET_ID = 'fa94ab3e-d02f-4c50-88e1-f017c9069c4d';

export const DEMO_TURBINE_ASSET_1 = '9398211b-2d05-4c2f-9b19-7803e8f75e2c';
export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = '8606da63-9690-40ef-b01e-281d6fdee9e6';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = 'ddba2621-65d6-4f8d-9608-e70f4f423ef9';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = 'f0a18839-70f0-48b0-83b2-22c22f6a89d6';
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = '6fc0a3ae-d07d-4e0d-85e2-9111ca017b86';

export const ASSET_DETAILS_QUERY = {
  assetId: STRING_ASSET_ID,
};

const AGGREGATED_DATA_ASSET = STRING_ASSET_ID;
const AGGREGATED_DATA_PROPERTY = 'b1616ab4-7526-4c0a-85e2-a137cf57d668';
const AGGREGATED_DATA_PROPERTY_2 = '729479fb-8720-4a70-bd55-2a9f9eaaa32e4';

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
    return initialize({ awsCredentials: getEnvCredentials(), awsRegion: 'us-west-2' }).query;
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

// From demo turbine asset, found at https://p-rlvy2rj8.app.iotsitewise.aws/
// These resources will eventually expire and need to be manually updated,
// because the demo turbine assets expire after 7 days.
