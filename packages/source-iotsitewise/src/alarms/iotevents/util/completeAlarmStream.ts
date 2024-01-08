import { getAlarmStateProperty } from './getAlarmStateProperty';
import { constructAlarmStreamData } from './constructAlarmStreamData';
import { toDataType } from '../../../time-series-data/util/toDataType';
import { ALARM_STATUS } from '../constants';
import type { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import type { DataStream } from '@iot-app-kit/core';

/**
 * infer if stream is an AWS IoT Events alarm stream ingested into AWS SiteWise Asset Alarm State Property
 */
const isIoTEventsAlarmStateProperty = (
  propertyValue?: string | number | boolean
): boolean => {
  if (typeof propertyValue === 'string') {
    try {
      const { stateName } = JSON.parse(propertyValue);

      return Object.keys(ALARM_STATUS).includes(stateName.toUpperCase());
    } catch {
      return false;
    }
  }
  return false;
};

export const completeAlarmStream = ({
  assetModel,
  propertyId,
  dataStream,
}: {
  propertyId: string;
  assetModel?: DescribeAssetModelResponse;
  dataStream: DataStream;
}): DataStream | undefined => {
  if (!assetModel) {
    if (
      isIoTEventsAlarmStateProperty(
        dataStream.data[dataStream.data?.length - 1]?.y
      )
    ) {
      return {
        ...dataStream,
        streamType: 'ALARM',
        data: constructAlarmStreamData({ data: dataStream.data }),
      } as DataStream;
    }

    return;
  }

  const alarmStateProperty = getAlarmStateProperty(assetModel, propertyId);

  if (!alarmStateProperty) {
    return;
  }

  return {
    ...dataStream,
    name: alarmStateProperty.name,
    streamType: 'ALARM',
    data: constructAlarmStreamData({ data: dataStream.data }),
    dataType: toDataType(alarmStateProperty.dataType),
  } as DataStream;
};
