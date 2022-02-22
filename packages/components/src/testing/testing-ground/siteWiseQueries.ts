const STRING_ASSET_ID = 'f2f74fa8-625a-435f-b89c-d27b2d84f45b';

export const DEMO_TURBINE_ASSET_1 = '00eeb4b1-5017-48d4-9f39-1066f080a822';

export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = '8739b557-3e77-4df9-9862-130b29dee2b1';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = '9701d7ad-c22e-43fd-b040-68bad00317e3';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = 'bded202a-a436-46b8-85c1-21bb5b945f86';
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
        { propertyId: AGGREGATED_DATA_PROPERTY, resolution: '0' },
        { propertyId: AGGREGATED_DATA_PROPERTY_2 },
      ],
    },
  ],
};

// From demo turbine asset, found at https://p-rlvy2rj8.app.iotsitewise.aws/
// These resources will eventually expire and need to be manually updated,
// because the demo turbine assets expire after 7 days.
