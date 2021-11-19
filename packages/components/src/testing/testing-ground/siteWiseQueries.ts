const STRING_ASSET_ID = '888dbcd1-cdfe-44ba-a99b-0ad3ca19a019';
const STRING_PROPERTY_ID = '9bd13790-377b-429f-87b0-43382b1709fd';

const DEMO_TURBINE_ASSET_1 = '888dbcd1-cdfe-44ba-a99b-0ad3ca19a019';

const DEMO_TURBINE_ASSET_1_PROPERTY_1 = '9bd13790-377b-429f-87b0-43382b1709fd';
const DEMO_TURBINE_ASSET_1_PROPERTY_2 = 'ca1799ee-eb20-41b9-b206-f4defc2604ef';
const DEMO_TURBINE_ASSET_1_PROPERTY_3 = 'a8bf93a1-91ed-4e37-9f2b-cede86ba81b9';
const DEMO_TURBINE_ASSET_1_PROPERTY_4 = 'f6c3961a-f6e2-46c5-8973-f878066be645';

export const STRING_QUERY = {
  source: 'site-wise',
  assets: [{ assetId: STRING_ASSET_ID, propertyIds: [STRING_PROPERTY_ID] }],
};

export const ASSET_DETAILS_QUERY = {
  assetId: STRING_ASSET_ID,
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
