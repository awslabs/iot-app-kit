import { type DataStream } from '@iot-app-kit/core';
import { type AlarmDataState } from '../../types';
import { fromId } from '@iot-app-kit/source-iotsitewise';

const dataStreamIsForAlarm =
  (alarmData: AlarmDataState) =>
  ({ id }: DataStream) => {
    const propertyInfo = fromId(id);
    if (!('assetId' in propertyInfo)) return false;

    const { assetId, propertyId } = propertyInfo;

    if (alarmData.assetId !== assetId) return false;

    return (
      alarmData.inputProperty
        ?.map(({ property: { id } }) => id)
        .includes(propertyId) ?? false
    );
  };

export const filterDataStreamsForAlarm = (
  alarmData: AlarmDataState,
  dataStreams: DataStream[]
) => {
  return dataStreams.filter(dataStreamIsForAlarm(alarmData));
};
