import { useEffect } from 'react';
import { DataStream } from '@iot-app-kit/core';
import { ChartRef } from '../../../hooks/useECharts';
import { ChartAlarms } from '../hooks/useChartAlarms';
import { fromId } from '@iot-app-kit/source-iotsitewise';
import { bisector } from 'd3-array';
import { DataPoint } from '@iot-app-kit/charts-core';
import { PascalCaseStateName } from '../../../hooks/useAlarms/transformers';
// import { createNonNullableList } from '../../../utils/createNonNullableList';

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
  alarmState?: PascalCaseStateName;
};
const dataSetBisector = bisector(
  (dataPoint: DataPointWithAlarm) => dataPoint.x
);

/**
 *
 * alarm datastreams are mapped in a prior hook
 */
const convertToDataSet = (dataStreams: DataStream[], alarms: ChartAlarms) => {
  return dataStreams.map(({ id, data }) => {
    const propertyInfo = fromId(id);
    // let associatedAlarm = [];
    const dataCopy = [...data] as DataPointWithAlarm[];
    if ('assetId' in propertyInfo) {
      const associatedAlarm = alarms.find((a) => {
        return (
          a.assetId === propertyInfo.assetId &&
          a.propertyId === propertyInfo.propertyId
        );
      });
      if (associatedAlarm != null) {
        associatedAlarm.events.forEach((event) => {
          const i = dataSetBisector.right(dataCopy, event.x);
          const pointBefore = dataCopy[i - 1];
          const pointAfter = dataCopy[i + 1];
          const eventCopy = {
            ...event,
            y: event.y ?? getY(pointBefore, pointAfter, event.x),
            showAlarmYLabelValue: event.y != null,
          };
          dataCopy.splice(i, 0, eventCopy);
        });
      }
    }
    return {
      source: dataCopy,
    };
  });
};

/**
 * Hook to set the data points values for each datastream on a chart
 */
export const useChartDataset = (
  chartRef: ChartRef,
  dataStreams: DataStream[],
  alarms: ChartAlarms
) => {
  useEffect(() => {
    chartRef.current?.setOption({
      dataset: convertToDataSet(dataStreams, alarms),
    });
  }, [chartRef, dataStreams, alarms]);
};
