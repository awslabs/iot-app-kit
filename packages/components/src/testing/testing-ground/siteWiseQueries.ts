const STRING_ASSET_ID = 'f2f74fa8-625a-435f-b89c-d27b2d84f45b';

export const DEMO_TURBINE_ASSET_1 = '863d5ed3-fdea-4720-97d1-54fe14d8a599';
export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = 'feecfa93-80f0-40bd-b295-ce9f00cf01fe'; //rpm
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = '2cbeebde-2747-48e1-8717-acb5f3d9c730'; //avg wind speed
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = 'd953474c-6f74-4daa-90dc-888e9190a130'; //torque (kN/M)
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = 'd8937b65-5f03-4e40-93ac-c5513420ade7';
export const UNFOUNDED_PROPERTY = 'd8937b65-5f03-4e40-93ac-c5513420ade3';
export const DEMO_TURBINE_ASSET_2 = 'f8ce6619-af20-4c26-93db-e9ee17820d09';
export const DEMO_TURBINE_ASSET_3 = '5b054c8e-ad23-4228-8620-826859ddf675';

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
