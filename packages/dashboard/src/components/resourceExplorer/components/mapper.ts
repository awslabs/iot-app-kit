import type { AssetCompositeModel, AssetProperty, DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';

export const isAlarm = (item: AssetCompositeModel) => item.type === 'AWS/ALARM';

export const isAlarmState = (property: AssetProperty) => property.name === 'AWS/ALARM_STATE';

export type PropertySummary = {
  propertyId: AssetProperty['id'];
  name: AssetProperty['name'];
  unit: AssetProperty['unit'];
  dataType: AssetProperty['dataType'];
  alias: AssetProperty['alias'];
};

export type AlarmSummary = {
  name: AssetCompositeModel['name'];
  id: AssetCompositeModel['id'];
  properties: PropertySummary[];
};

export type AssetSummary = {
  assetId: DescribeAssetResponse['assetId'];
  assetName: DescribeAssetResponse['assetName'];
  properties: PropertySummary[];
  alarms: AlarmSummary[];
};

const mapPropertySummary = ({ id, name, unit, dataType, alias }: AssetProperty): PropertySummary => ({
  propertyId: id,
  name,
  unit,
  dataType,
  alias,
});

const mapCompositeModelToAlarmSummary = (model: AssetCompositeModel): AlarmSummary => ({
  name: model.name,
  id: model?.id,
  properties:
    model.properties
      ?.filter(isAlarmState)
      .map(({ id, unit, dataType, alias }) => mapPropertySummary({ id, unit, dataType, alias, name: model.name })) ??
    [],
});

export const mapAssetDescriptionToAssetSummary = (description: DescribeAssetResponse): AssetSummary => ({
  assetId: description.assetId,
  assetName: description.assetName,
  properties: description.assetProperties?.map(mapPropertySummary) ?? [],
  alarms: description.assetCompositeModels?.filter(isAlarm).map(mapCompositeModelToAlarmSummary) ?? [],
});
