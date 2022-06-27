import { AssetModelProperty, DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';

export const getAlarmSourceProperty = (
  assetModel: DescribeAssetModelResponse,
  alarmStatePropertyId: string
): AssetModelProperty | undefined =>
  assetModel.assetModelCompositeModels
    ?.filter(({ type }) => type === 'AWS/ALARM')
    .map(({ properties }) => properties)
    .filter((properties) => properties?.some((property) => property?.id === alarmStatePropertyId))
    .flat()
    .find((property) => property?.name === 'AWS/ALARM_SOURCE');
