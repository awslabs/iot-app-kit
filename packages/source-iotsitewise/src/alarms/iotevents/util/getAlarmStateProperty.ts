import { DescribeAssetModelResponse, AssetModelProperty } from '@aws-sdk/client-iotsitewise';

export const getAlarmStateProperty = (
  assetModel: DescribeAssetModelResponse,
  alarmStatePropertyId: string
): AssetModelProperty | undefined =>
  assetModel.assetModelCompositeModels
    ?.filter(({ type }) => type === 'AWS/ALARM')
    .map(({ properties }) => properties)
    .flat()
    .find((property) => property?.id === alarmStatePropertyId && property?.name === 'AWS/ALARM_STATE');
