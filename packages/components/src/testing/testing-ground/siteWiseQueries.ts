const STRING_ASSET_ID = 'f2f74fa8-625a-435f-b89c-d27b2d84f45b';

export const DEMO_TURBINE_ASSET_1 = '08654543-acb0-403d-96d4-eee30b89d7b4';
export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = 'e07aed33-334a-41bf-9589-db1e6b2655ca';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = 'a94f4a39-4fd1-4c5b-a466-5e1c7a8c0a53';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = 'f167c24f-3e35-42b4-b493-3b13fe4fbf79';
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = 'd8937b65-5f03-4e40-93ac-c5513420ade7';

export const ASSET_DETAILS_QUERY = {
  assetId: STRING_ASSET_ID,
};

const AGGREGATED_DATA_ASSET = STRING_ASSET_ID;
const AGGREGATED_DATA_PROPERTY = 'd0dc79be-0dc2-418c-ac23-26f33cdb4b8b';
const AGGREGATED_DATA_PROPERTY_2 = '69607dc2-5fbe-416d-aac2-0382018626e4';

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

// From demo turbine asset, found at https://p-rlvy2rj8.app.iotsitewise.aws/
// These resources will eventually expire and need to be manually updated,
// because the demo turbine assets expire after 7 days.
