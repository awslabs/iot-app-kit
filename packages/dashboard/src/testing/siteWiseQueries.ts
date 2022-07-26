const STRING_ASSET_ID = '1ecfbcab-e22a-48b6-a997-dffc3d0ac79f';

export const DEMO_TURBINE_ASSET_1 = '26ba1f64-0eae-49aa-b36c-d859176b8b0c';
export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = '165e4649-faa2-473c-adaa-872eadadb037';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = '31c34b67-5ba0-4604-813f-4c59f0368d0b';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = 'f27963c9-a361-417f-8969-cc7fc4285cd3';
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = '803e994d-4c7d-4de3-9280-246e8d0237b7';

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
