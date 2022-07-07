const STRING_ASSET_ID = 'f2f74fa8-625a-435f-b89c-d27b2d84f45b';

export const DEMO_TURBINE_ASSET_1 = 'fa94ab3e-d02f-4c50-88e1-f017c9069c4d';
export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = 'f63861af-251e-4d0b-a32e-4d2089d35b1c'; //rpm
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = 'e43ce879-b39e-4779-9d74-1f9b188036d8'; //avg wind speed
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = 'ea55054e-55d0-4eda-8359-2cbc19d52a3d'; //torque
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = 'd8937b65-5f03-4e40-93ac-c5513420ade7';
export const UNFOUNDED_PROPERTY = 'd8937b65-5f03-4e40-93ac-c5513420ade3';
export const DEMO_TURBINE_ASSET_2 = 'e6fb533c-4919-4981-a71f-7764ccc10867';
export const DEMO_TURBINE_ASSET_3 = 'bc86bf78-c506-460c-8602-0c534356892a';

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
