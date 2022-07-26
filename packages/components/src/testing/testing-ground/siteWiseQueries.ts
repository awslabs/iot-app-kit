const STRING_ASSET_ID = 'fa94ab3e-d02f-4c50-88e1-f017c9069c4d';

export const DEMO_TURBINE_ASSET_1 = 'fa94ab3e-d02f-4c50-88e1-f017c9069c4d';
export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = 'f63861af-251e-4d0b-a32e-4d2089d35b1c';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = 'ea55054e-55d0-4eda-8359-2cbc19d52a3d';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = '18faca18-a8e5-4e48-9153-462c54980869';
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = '95648016-38d0-45e7-8f53-872404b9b471';

export const DEMO_TURBINE_ASSET_2 = 'e6fb533c-4919-4981-a71f-7764ccc10867';
export const DEMO_TURBINE_ASSET_2_PROPERTY_1 = 'f63861af-251e-4d0b-a32e-4d2089d35b1c';
export const DEMO_TURBINE_ASSET_2_PROPERTY_2 = 'ea55054e-55d0-4eda-8359-2cbc19d52a3d';
export const DEMO_TURBINE_ASSET_2_PROPERTY_3 = '18faca18-a8e5-4e48-9153-462c54980869';
export const DEMO_TURBINE_ASSET_2_PROPERTY_4 = '95648016-38d0-45e7-8f53-872404b9b471';

export const DEMO_TURBINE_ASSET_3 = 'bc86bf78-c506-460c-8602-0c534356892a';
export const DEMO_TURBINE_ASSET_3_PROPERTY_1 = 'f63861af-251e-4d0b-a32e-4d2089d35b1c';
export const DEMO_TURBINE_ASSET_3_PROPERTY_2 = 'ea55054e-55d0-4eda-8359-2cbc19d52a3d';
export const DEMO_TURBINE_ASSET_3_PROPERTY_3 = '18faca18-a8e5-4e48-9153-462c54980869';
export const DEMO_TURBINE_ASSET_3_PROPERTY_4 = '95648016-38d0-45e7-8f53-872404b9b471';

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
