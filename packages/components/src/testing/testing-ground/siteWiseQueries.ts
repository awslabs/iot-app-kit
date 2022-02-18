const STRING_ASSET_ID = 'f2f74fa8-625a-435f-b89c-d27b2d84f45b';
const STRING_PROPERTY_ID = '797482e4-692f-45a2-b3db-17979481e9c3';

export const DEMO_TURBINE_ASSET_1 = '00eeb4b1-5017-48d4-9f39-1066f080a822';

export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = '8739b557-3e77-4df9-9862-130b29dee2b1';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = '9701d7ad-c22e-43fd-b040-68bad00317e3';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = 'bded202a-a436-46b8-85c1-21bb5b945f86';
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = 'd8937b65-5f03-4e40-93ac-c5513420ade7';

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

const AGGREGATED_DATA_ASSET = '099b1330-83ff-4fec-b165-c7186ec8eb23';
const AGGREGATED_DATA_PROPERTY = '05c5c47f-fd92-4823-828e-09ce63b90569';
const AGGREGATED_DATA_PROPERTY_2 = '11d2599a-2547-451d-ab79-a47f878dbbe3';

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
