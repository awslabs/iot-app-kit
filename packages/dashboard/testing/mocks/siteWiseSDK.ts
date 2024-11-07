import {
  type DescribeAssetResponse,
  PropertyDataType,
} from '@aws-sdk/client-iotsitewise';

export const mockAssetDescription: DescribeAssetResponse = {
  assetModelId: 'mock-asset-model-id',
  assetName: 'Mock Asset',
  assetId: 'mock-id',
  assetProperties: [
    {
      name: 'property one',
      id: 'property-1',
      dataType: PropertyDataType.DOUBLE,
      alias: 'P1',
    },
    {
      name: 'property two',
      id: 'property-2',
      dataType: PropertyDataType.STRING,
    },
  ],
  assetCompositeModels: [
    {
      description: undefined,
      id: '49fc8566-c042-4319-96b7-4835c2e5b59c',
      name: 'windSpeedAlarm',
      type: 'AWS/ALARM',
      properties: [
        {
          alias: undefined,
          dataType: 'STRING',
          dataTypeSpec: undefined,
          id: 'dfdf918e-4367-4c2d-9dd3-2a710389b512',
          name: 'AWS/ALARM_TYPE',
        },
        {
          alias: undefined,
          dataType: 'STRUCT',
          dataTypeSpec: 'AWS/ALARM_STATE',
          id: 'e70495ff-c016-4175-9012-62c37857e0d1',
          name: 'AWS/ALARM_STATE',
        },
      ],
    },
  ],
  assetArn: undefined,
  assetHierarchies: undefined,
  assetCreationDate: undefined,
  assetLastUpdateDate: undefined,
  assetStatus: undefined,
};
