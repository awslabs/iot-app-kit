import {
  type AssetCompositeModel,
  type AssetProperty,
  type DescribeAssetResponse,
} from '@aws-sdk/client-iotsitewise';

export interface PropertySummary {
  propertyId: AssetProperty['id'];
  name: AssetProperty['name'];
  unit: AssetProperty['unit'];
  dataType: AssetProperty['dataType'];
  alias: AssetProperty['alias'];
}

export interface AlarmSummary {
  name: AssetCompositeModel['name'];
  id: AssetCompositeModel['id'];
  properties: PropertySummary[];
}

export interface AssetSummary {
  assetId: DescribeAssetResponse['assetId'];
  assetName: DescribeAssetResponse['assetName'];
  properties: PropertySummary[];
  alarms: AlarmSummary[];
  assetCompositeModels?: AssetCompositeModel[];
}
