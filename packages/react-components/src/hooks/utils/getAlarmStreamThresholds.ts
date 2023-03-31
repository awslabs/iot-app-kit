import type { Threshold, DataStream } from '@iot-app-kit/core';

export const getAlarmStreamThresholds = ({
  thresholds,
  dataStreams,
}: {
  thresholds: Threshold[];
  dataStreams: DataStream[];
}): Threshold[] =>
  thresholds.filter((yAnnotation) => {
    return (
      'dataStreamIds' in yAnnotation &&
      yAnnotation.dataStreamIds?.some((dataStreamId) =>
        dataStreams.some((dataStream) => dataStream.streamType === 'ALARM' && dataStreamId === dataStream.id)
      )
    );
  });
