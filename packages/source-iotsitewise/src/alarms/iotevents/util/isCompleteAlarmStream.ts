import { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { getAlarmStateProperty } from './getAlarmStateProperty';
import { Alarms } from '../types';
import { isDefined } from '../../../common/predicates';

export const isCompleteAlarmStream = ({
  propertyId,
  dataStreamId,
  assetModel,
  alarms,
}: {
  propertyId: string;
  dataStreamId: string;
  assetModel: DescribeAssetModelResponse;
  alarms: Alarms;
}): boolean => {
  const alarmStateProperty = getAlarmStateProperty(assetModel, propertyId);

  if (alarmStateProperty) {
    return isDefined(alarms[dataStreamId]);
  }

  return true;
};
