import { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { DataStream } from '@iot-app-kit/core';
import { toSiteWiseAssetProperty } from './time-series-data/util/dataStreamId';
import { Alarms } from './alarms/iotevents';
import { isCompleteAlarmStream } from './alarms/iotevents/util/isCompleteAlarmStream';
import { completePropertyStream } from './asset-modules/util/completePropertyStream';
import { completeAlarmStream } from './alarms/iotevents/util/completeAlarmStream';

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
  return dataStreams
    .filter((dataStream) => {
      const dataStreamId = dataStream.id;
      const { assetId, propertyId } = toSiteWiseAssetProperty(dataStreamId);
      const assetModel = assetModels[assetId];

      if (!assetModel) {
        return true;
      }

      return isCompleteAlarmStream({ propertyId, dataStreamId, assetModel, alarms });
    })
    .map((dataStream) => {
      const { assetId, propertyId } = toSiteWiseAssetProperty(dataStream.id);
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
