const STRING_ASSET_ID = '9a9ca8e2-779d-443f-93a9-c287fd8f9c66';
const STRING_PROPERTY_ID = '9530e220-b353-4331-b4b3-cf0949c8684d';

const DEMO_TURBINE_ASSET_1 = 'c9884a1e-bbc1-4692-a107-327c4b76cea7';

const DEMO_TURBINE_ASSET_1_PROPERTY_1 = 'a051b46f-b9ed-431f-8d1b-470660980c53';
const DEMO_TURBINE_ASSET_1_PROPERTY_2 = 'd0ac14ae-975e-4cea-9418-3ad6c9ce5559';
const DEMO_TURBINE_ASSET_1_PROPERTY_3 = '0dade017-e20d-4d79-9319-1e73d36c7987';
const DEMO_TURBINE_ASSET_1_PROPERTY_4 = 'ba6588b4-b580-429c-ac60-26ea3bd8b939';

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
