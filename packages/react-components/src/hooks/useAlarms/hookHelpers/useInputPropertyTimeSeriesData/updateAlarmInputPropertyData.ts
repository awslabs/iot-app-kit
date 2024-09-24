import { DataStream } from '@iot-app-kit/core';
import { matchesDatastream } from './filterDatastreamsForAlarm';
import { AlarmData } from '../../types';
export const updateAlarmInputPropertyData = (
  alarm: AlarmData,
  dataStreams: DataStream[]
): AlarmData => {
  const { assetId, inputProperty } = alarm;

  /**
   * Do nothing if assetId or inputProperty
   * have not yet been fetched
   */
  if (assetId == null || inputProperty == null) return alarm;

  /**
   * update inputProperty data with the corresponding
   * datastream data
   */
  alarm.inputProperty = inputProperty.map((property) => {
    const {
      property: { id: propertyId },
    } = property;

    const datastream = dataStreams.find(
      matchesDatastream({ assetId, propertyId })
    );

    /**
     * Do nothing if the datastream is not
     * yet created
     */
    if (datastream == null) return property;

    property.dataStream = datastream;

    return property;
  });

  return alarm;
};
