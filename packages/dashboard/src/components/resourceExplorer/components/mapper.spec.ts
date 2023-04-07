import { mapAssetDescriptionToAssetSummary } from './mapper';
import type { AssetCompositeModel, AssetProperty, DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';

const mockAssetProperty: AssetProperty = {
  alias: undefined,
  dataType: 'STRING',
  dataTypeSpec: undefined,
  id: '8a33fb7e-c1fc-46b3-b42e-5a04ab3aac84',
  name: 'Make',
  unit: 'Unit',
};

const mockAssetCompositeModel: AssetCompositeModel = {
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
};

const mockAssetDescriptionResponse: DescribeAssetResponse = {
  assetId: 'assetId',
  assetArn: 'assetArn',
  assetName: 'Demo Turbine Asset 1',
  assetModelId: 'assetModelId',
  assetProperties: [mockAssetProperty],
  assetCompositeModels: [mockAssetCompositeModel],
  assetHierarchies: undefined,
  assetCreationDate: undefined,
  assetLastUpdateDate: undefined,
  assetStatus: undefined,
};

it('can map an asset description to asset summary', () => {
  expect(mapAssetDescriptionToAssetSummary(mockAssetDescriptionResponse)).toEqual({
    assetId: 'assetId',
    assetName: 'Demo Turbine Asset 1',
    properties: [
      {
        propertyId: '8a33fb7e-c1fc-46b3-b42e-5a04ab3aac84',
        name: 'Make',
        alias: undefined,
        dataType: 'STRING',
        unit: 'Unit',
      },
    ],
    alarms: [
      {
        name: 'windSpeedAlarm',
        id: '49fc8566-c042-4319-96b7-4835c2e5b59c',
        properties: [
          {
            propertyId: 'e70495ff-c016-4175-9012-62c37857e0d1',
            name: 'windSpeedAlarm',
            unit: undefined,
            alias: undefined,
            dataType: 'STRUCT',
          },
        ],
      },
    ],
  });
});
