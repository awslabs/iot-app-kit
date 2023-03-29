import type {
  DescribeAssetModelResponse,
  AssetModelProperty,
  AssetModelCompositeModel,
} from '@aws-sdk/client-iotsitewise';
import first from 'lodash/first';
import { isDefined } from '../../../common/predicates';

const isAlarm = (model: AssetModelCompositeModel) => model.type === 'AWS/ALARM';
const isAlarmState = (property: AssetModelProperty) => property.name === 'AWS/ALARM_STATE';

const getAlarmStatePropertyFromAssetModel =
  (alarmStatePropertyId: string) =>
  ({ properties, name }: AssetModelCompositeModel): AssetModelProperty | undefined => {
    const alarmStateProperty = properties?.find(
      (property) => property?.id === alarmStatePropertyId && isAlarmState(property)
    );

    return (
      alarmStateProperty && {
        ...alarmStateProperty,
        name,
      }
    );
  };

export const getAlarmStateProperty = (
  assetModel: DescribeAssetModelResponse,
  alarmStatePropertyId: string
): AssetModelProperty | undefined =>
  first(
    assetModel.assetModelCompositeModels
      ?.filter(isAlarm)
      .map(getAlarmStatePropertyFromAssetModel(alarmStatePropertyId))
      .filter(isDefined)
  );
