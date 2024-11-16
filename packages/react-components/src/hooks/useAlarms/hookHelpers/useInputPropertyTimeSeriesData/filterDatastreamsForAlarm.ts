import { type DataStream } from '@iot-app-kit/core';
import { type AlarmData } from '../../types';
import { fromId } from '@iot-app-kit/source-iotsitewise';

export const dataStreamIsForAlarm =
  (alarm: AlarmData) =>
  ({ id }: DataStream) => {
    const propertyInfo = fromId(id);
    if (!('assetId' in propertyInfo)) return false;

    const { assetId, propertyId } = propertyInfo;

    if (alarm.assetId !== assetId) return false;

    return (
      alarm.inputProperty
        ?.map(({ property: { id } }) => id)
        .includes(propertyId) ?? false
    );
  };

export const matchesDatastream =
  ({ assetId, propertyId }: { assetId?: string; propertyId?: string }) =>
  ({ id }: DataStream) => {
    const propertyInfo = fromId(id);
    if (!('assetId' in propertyInfo)) return false;

    const { assetId: datastreamAssetId, propertyId: datastreamPropertyId } =
      propertyInfo;

    return datastreamAssetId === assetId && datastreamPropertyId === propertyId;
  };

export const filterDataStreamsForAlarm = (
  alarm: AlarmData,
  dataStreams: DataStream[]
) => {
  return dataStreams.filter(dataStreamIsForAlarm(alarm));
};
