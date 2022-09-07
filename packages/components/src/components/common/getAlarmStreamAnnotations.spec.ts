import { getAlarmStreamAnnotations } from './getAlarmStreamAnnotations';
import { TIME_SERIES_DATA_WITH_ALARMS } from '@iot-app-kit/source-iotsitewise';

it('should return alarm stream annotations', () => {
  const { annotations, dataStreams } = TIME_SERIES_DATA_WITH_ALARMS;

  const ALARM_STREAM_ANNOTATIONS = {
    y: annotations.y.filter((yAnnotation) => {
      return yAnnotation?.dataStreamIds.includes('alarm-asset-id---alarm-state-property-id');
    }),
  };

  expect(getAlarmStreamAnnotations({ annotations, dataStreams })).toEqual(ALARM_STREAM_ANNOTATIONS);
});
