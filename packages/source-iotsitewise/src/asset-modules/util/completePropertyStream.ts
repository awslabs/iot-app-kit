import { toDataType } from '../../time-series-data/util/toDataType';
import { StreamType } from '@synchro-charts/core';
import type { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import type { DataStream } from '@iot-app-kit/core';
import type { Alarms } from '../../alarms/iotevents';
import { ModeledDataStream } from '../listAssetModelPropertiesWithCompositeModels';

export const completePropertyStream = ({
  assetModel,
  assetId,
  propertyId,
  dataStream,
  alarms,
  assetModelProperties,
}: {
  assetModel?: DescribeAssetModelResponse;
  assetId: string;
  propertyId: string;
  dataStream: DataStream;
  alarms: Alarms;
  assetModelProperties: ModeledDataStream[];
}): DataStream | undefined => {
  if (!assetModel) {
    return;
  }

  const property = assetModelProperties?.find(({ propertyId: id }) => id === propertyId);

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
