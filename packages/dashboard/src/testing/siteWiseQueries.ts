const STRING_ASSET_ID = '1ecfbcab-e22a-48b6-a997-dffc3d0ac79f';

export const DEMO_TURBINE_ASSET_1 = 'a9611ad4-ed95-45d9-9d80-369ac035940c';
export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = '1415d243-3b68-4fbb-bdc3-756b79550974';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = 'd914778e-ba3d-4863-a403-ee15694c9511';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = '67da0eb7-ba59-409b-aef5-8dc94c7e9adf';
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = 'b9c2c6a5-cc0b-499a-99b3-b74fdba57675';

export const ASSET_DETAILS_QUERY = {
  assetId: STRING_ASSET_ID,
};

const AGGREGATED_DATA_ASSET = STRING_ASSET_ID;
const AGGREGATED_DATA_PROPERTY = '1415d243-3b68-4fbb-bdc3-756b79550974';
const AGGREGATED_DATA_PROPERTY_2 = 'd914778e-ba3d-4863-a403-ee15694c9511';

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
