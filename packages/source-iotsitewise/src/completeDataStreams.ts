import { fromId } from './time-series-data/util/dataStreamId';
import { completePropertyStream } from './asset-modules/util/completePropertyStream';
import { completeAlarmStream } from './alarms/iotevents/util/completeAlarmStream';
import type { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import type { DataStream } from '@iot-app-kit/core';
import type { Alarms } from './alarms/iotevents';

/**
 * Get completed data streams by merging together the data streams with the asset models and alarms.
 */
export const completeDataStreams = ({
  dataStreams,
  assetModels,
  alarms,
}: {
  dataStreams: DataStream[];
  assetModels: Record<string, DescribeAssetModelResponse>;
  alarms: Alarms;
}): DataStream[] => {
  return dataStreams.map((dataStream) => {
    const propertyInfo = fromId(dataStream.id);
    if ('propertyAlias' in propertyInfo) {
      return dataStream;
    }
    const { assetId, propertyId } = propertyInfo;

    const assetModel = assetModels[assetId];

    const propertyStream = completePropertyStream({ assetModel, dataStream, assetId, propertyId, alarms });
    const alarmPropertyStream = completeAlarmStream({ assetModel, propertyId, dataStream });

    if (propertyStream) {
      return propertyStream;
    }

    if (alarmPropertyStream) {
      return alarmPropertyStream;
    }

    return dataStream;
  });
};
