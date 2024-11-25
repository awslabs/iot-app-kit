import { type DataPoint, type DataStream } from '@iot-app-kit/core';
import { fromId, toId } from '@iot-app-kit/source-iotsitewise';
import { type ChartAlarm, type ChartAlarms } from './useChartAlarms';
import { createNonNullableList } from '../../../utils/createNonNullableList';
import { useMemo } from 'react';
import { bisector } from 'd3-array';
import { uniqWith } from 'lodash';
import { type AlarmContent } from '../../alarm-components/alarm-content/types';
import type { AlarmAssistantContext } from '../../../common/assistantProps';

const interpolateY = (
  point1: DataPointWithAlarm,
  point2: DataPointWithAlarm,
  x: number
) => {
  const gradient = (point2.y - point1.y) / (point2.x - point1.x);
  const intercept = point1.y - gradient * point1.x;
  return gradient * x + intercept;
};

const getY = (
  point1: DataPointWithAlarm | undefined,
  point2: DataPointWithAlarm | undefined,
  x: number
) => {
  if (point1 != null && point2 != null) return interpolateY(point1, point2, x);
  else if (point1 == null && point2 != null) return point2.y;
  else if (point1 != null && point2 == null) return point1.y;

  return 0;
};

type DataPointWithAlarm = DataPoint<number> & {
  showAlarmYLabelValue?: boolean;
} & AlarmContent;
const dataSetBisector = bisector(
  (dataPoint: DataPointWithAlarm) => dataPoint.x
);

type UseNormalizedDataStreamsOptions = {
  dataStreams: DataStream[];
  alarms: ChartAlarms;
};

export type DataStreamWithLatestAlarmState = DataStream & {
  latestAlarmStateValue?: string;
} & AlarmAssistantContext;

export const useNormalizedDataStreams = ({
  dataStreams,
  alarms,
}: UseNormalizedDataStreamsOptions): DataStreamWithLatestAlarmState[] => {
  // console.log(dataStreams);
  return useMemo(() => {
    const alarmDataStreams = createNonNullableList(
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

    const normalizedDatastreams = [...dataStreams, ...alarmDataStreams].map(
      ({ id, data, ...rest }) => {
        const propertyInfo = fromId(id);
        const dataCopy = [...data] as DataPointWithAlarm[];
        let latestAlarmStateValue: string | undefined = undefined;
        let associatedAlarm: ChartAlarm | undefined;
        if ('assetId' in propertyInfo) {
          associatedAlarm = alarms.find((a) => {
            return (
              a.assetId === propertyInfo.assetId &&
              a.propertyId === propertyInfo.propertyId
            );
          });
          if (associatedAlarm != null) {
            (latestAlarmStateValue =
              associatedAlarm.events?.at(-1)?.alarmState),
              associatedAlarm.events?.forEach((event) => {
                let deleteCount = 0;
                let i = dataSetBisector.right(dataCopy, event.x);

                const pointBefore = dataCopy[i - 1];
                const pointAfter = dataCopy[i + 1];

                if (pointBefore?.x === event.x) {
                  i = i - 1;
                  deleteCount = 1;
                }
                if (pointAfter?.x === event.x) {
                  i = i + 1;
                  deleteCount = 1;
                }

                const eventCopy = {
                  ...event,
                  y: event.y ?? getY(pointBefore, pointAfter, event.x),
                  showAlarmYLabelValue: event.y != null,
                } satisfies DataPointWithAlarm;
                dataCopy.splice(i, deleteCount, eventCopy);
              });
          }
        }
        return {
          id,
          data: dataCopy,
          latestAlarmStateValue,
          assetId: associatedAlarm?.assetId,
          alarmName: associatedAlarm?.name,
          ...rest,
        };
      }
    );

    return uniqWith(normalizedDatastreams, (a, b) => a.id === b.id);
  }, [dataStreams, alarms]);
};
