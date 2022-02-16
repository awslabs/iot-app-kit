const STRING_ASSET_ID = 'f2f74fa8-625a-435f-b89c-d27b2d84f45b';
const STRING_PROPERTY_ID = '797482e4-692f-45a2-b3db-17979481e9c3';

export const DEMO_TURBINE_ASSET_1 = 'f2f74fa8-625a-435f-b89c-d27b2d84f45b';

export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = 'd0dc79be-0dc2-418c-ac23-26f33cdb4b8b';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = '69607dc2-5fbe-416d-aac2-0382018626e4';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = '26072fa0-e36e-489d-90b4-1774e7d12ac9';
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = '5c2b7401-57e0-4205-97f2-c4348f12da9a';

export const STRING_QUERY = {
  source: 'site-wise',
  assets: [{ assetId: STRING_ASSET_ID, properties: [{ propertyId: STRING_PROPERTY_ID }] }],
};

export const ASSET_DETAILS_QUERY = {
  assetId: STRING_ASSET_ID,
};

export const NUMBER_QUERY = {
  source: 'site-wise',
  assets: [
    {
      assetId: DEMO_TURBINE_ASSET_1,
      properties: [{ propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_1 }, { propertyId: DEMO_TURBINE_ASSET_1_PROPERTY_4 }],
    },
  ],
};

const AGGREGATED_DATA_ASSET = 'f2f74fa8-625a-435f-b89c-d27b2d84f45b';
const AGGREGATED_DATA_PROPERTY = 'd0dc79be-0dc2-418c-ac23-26f33cdb4b8b';
const AGGREGATED_DATA_PROPERTY_2 = '69607dc2-5fbe-416d-aac2-0382018626e4';

export const AGGREGATED_DATA_QUERY = {
  assets: [
    {
      assetId: AGGREGATED_DATA_ASSET,
      properties: [
        { propertyId: AGGREGATED_DATA_PROPERTY, resolution: '0' },
        { propertyId: AGGREGATED_DATA_PROPERTY_2 },
      ],
    },
  ],
};

// From demo turbine asset, found at https://p-rlvy2rj8.app.iotsitewise.aws/
// These resources will eventually expire and need to be manually updated,
// because the demo turbine assets expire after 7 days.
