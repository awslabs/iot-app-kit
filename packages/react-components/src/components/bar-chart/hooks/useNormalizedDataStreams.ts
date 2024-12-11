import { type DataStream } from '@iot-app-kit/core';
import { toId } from '@iot-app-kit/source-iotsitewise';
import { type BarChartAlarms } from './useBarChartAlarms';
import { compact } from '@iot-app-kit/helpers';
import { useMemo } from 'react';

type UseNormalizedDataStreamsOptions = {
  dataStreams: DataStream[];
  alarms: BarChartAlarms;
};

export const useNormalizedDataStreams = ({
  dataStreams,
  alarms,
}: UseNormalizedDataStreamsOptions): DataStream[] => {
  return useMemo(() => {
    const alarmDataStreams = compact(
      alarms
        .filter(({ assetId, propertyId, datastream }) => {
          if (assetId == null || propertyId == null || datastream == null)
            return false;
          return !dataStreams
            .map(({ id }) => id)
            .includes(toId({ assetId: assetId, propertyId: propertyId }));
        })
        .map(({ datastream }) => datastream)
    );

    const nonAlarmDataStreamIds = dataStreams.map(
      (dataStream) => dataStream.id
    );
    const dedupedAlarmDataStreams = alarmDataStreams.filter(
      (alarmDataStream) => !nonAlarmDataStreamIds.includes(alarmDataStream.id)
    );

    return [...dataStreams, ...dedupedAlarmDataStreams];
  }, [dataStreams, alarms]);
};
