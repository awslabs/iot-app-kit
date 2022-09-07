import { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { DataStream } from '@iot-app-kit/core';
import { toDataType } from '../../time-series-data/util/toDataType';
import { StreamType } from '@synchro-charts/core';
import { Alarms } from '../../alarms/iotevents';

export const completePropertyStream = ({
  assetModel,
  assetId,
  propertyId,
  dataStream,
  alarms,
}: {
  assetModel?: DescribeAssetModelResponse;
  assetId: string;
  propertyId: string;
  dataStream: DataStream;
  alarms: Alarms;
}): DataStream | undefined => {
  if (!assetModel) {
    return;
  }

  const { assetModelProperties } = assetModel;

  const property = assetModelProperties?.find(({ id }) => id === propertyId);

  if (!property) {
    return;
  }

  return {
    ...dataStream,
    name: property.name,
    unit: property.unit,
    dataType: toDataType(property.dataType),
    associatedStreams: Object.keys(alarms)
      .filter((id) => {
        const alarm = alarms[id];
        return alarm.assetId === assetId && alarm.inputPropertyId === propertyId;
      })
      .map((id) => ({
        id,
        type: StreamType.ALARM,
      })),
  };
};
