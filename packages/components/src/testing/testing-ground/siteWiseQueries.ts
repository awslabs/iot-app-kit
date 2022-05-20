const STRING_ASSET_ID = 'f122eb70-9be5-4a1c-8405-f8151a0e0983';

export const DEMO_TURBINE_ASSET_1 = 'f122eb70-9be5-4a1c-8405-f8151a0e0983';
export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = '4ec25172-2c4e-4983-867e-5b2ff7bb125b';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = '1bb7a280-921b-489a-bfc6-e2ed18025b35';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = '8f9a7f0e-79d6-4904-bc66-91351be11f9b';
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = '3e682aed-77a8-4e2d-85e0-6804553bc372';

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

// From demo turbine asset, found at https://p-rlvy2rj8.app.iotsitewise.aws/
// These resources will eventually expire and need to be manually updated,
// because the demo turbine assets expire after 7 days.
