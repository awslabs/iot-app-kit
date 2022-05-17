const STRING_ASSET_ID = 'cfc7f009-0512-4fa0-99b7-7e81932d22a2';

export const DEMO_TURBINE_ASSET_1 = 'cfc7f009-0512-4fa0-99b7-7e81932d22a2';
export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = '2bf69061-570a-48ae-bf62-60e9cd825e3c';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = 'f5e3b739-2249-44f5-ad97-458d5f759c66';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = '080b0891-14bc-4fa2-9153-8233985b1dda';
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = 'c18479fe-4ca7-45b0-b450-ad38d8bec225';

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
