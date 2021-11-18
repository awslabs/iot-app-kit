const STRING_ASSET_ID = '9a9ca8e2-779d-443f-93a9-c287fd8f9c66';
const STRING_PROPERTY_ID = '9530e220-b353-4331-b4b3-cf0949c8684d';

const DEMO_TURBINE_ASSET_1 = '4df123fc-dc29-470e-8fd2-9242a2d3fa17';

const DEMO_TURBINE_ASSET_1_PROPERTY_1 = '59868144-6bb2-4a96-9413-aa58d9398a07';
const DEMO_TURBINE_ASSET_1_PROPERTY_2 = '089948a3-71e5-4fbe-bd13-18f12a076ca7';
const DEMO_TURBINE_ASSET_1_PROPERTY_3 = '04f5dcbd-f5b1-4f41-a526-84203d3af3aa';
const DEMO_TURBINE_ASSET_1_PROPERTY_4 = 'e7a6fce5-4486-4a23-b40b-8a68cb493f02';

export const STRING_QUERY = {
  source: 'site-wise',
  assets: [{ assetId: STRING_ASSET_ID, propertyIds: [STRING_PROPERTY_ID] }],
};

export const NUMBER_QUERY = {
  source: 'site-wise',
  assets: [
    {
      assetId: DEMO_TURBINE_ASSET_1,
      propertyIds: [
        DEMO_TURBINE_ASSET_1_PROPERTY_1,
        DEMO_TURBINE_ASSET_1_PROPERTY_2,
        DEMO_TURBINE_ASSET_1_PROPERTY_3,
        DEMO_TURBINE_ASSET_1_PROPERTY_4,
      ],
    },
  ],
};

// From demo turbine asset, found at https://p-rlvy2rj8.app.iotsitewise.aws/
// These resources will eventually expire and need to be manually updated,
// because the demo turbine assets expire after 7 days.
