const STRING_ASSET_ID = 'f122eb70-9be5-4a1c-8405-f8151a0e0983';

export const DEMO_TURBINE_ASSET_1 = '8c385a4c-1b08-4369-b219-7e90ec1ea68f';
export const DEMO_TURBINE_ASSET_1_PROPERTY_1 = '5bf6bbad-93c4-4ba8-bd16-43fc04b9fd2d';
export const DEMO_TURBINE_ASSET_1_PROPERTY_2 = '53143d54-e319-45fa-adfd-0ef9cfcceb6b';
export const DEMO_TURBINE_ASSET_1_PROPERTY_3 = 'e9d76265-98aa-4328-bd2e-1b7b94a33593';
export const DEMO_TURBINE_ASSET_1_PROPERTY_4 = 'f61bd056-9a2a-4de7-a666-d774cf945e94';

export const DEMO_TURBINE_ASSET_2 = '300e3c02-1681-4406-a947-97bb971c3e4e';
export const DEMO_TURBINE_ASSET_2_PROPERTY_1 = '5bf6bbad-93c4-4ba8-bd16-43fc04b9fd2d';
export const DEMO_TURBINE_ASSET_2_PROPERTY_2 = '53143d54-e319-45fa-adfd-0ef9cfcceb6b';
export const DEMO_TURBINE_ASSET_2_PROPERTY_3 = 'e9d76265-98aa-4328-bd2e-1b7b94a33593';
export const DEMO_TURBINE_ASSET_2_PROPERTY_4 = 'f61bd056-9a2a-4de7-a666-d774cf945e94';

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
