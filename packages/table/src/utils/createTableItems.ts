import { Viewport, DataStream } from '@iot-app-kit/core';
import { breachedThreshold, Primitive, Threshold, DataStream as SC_DataStream } from '@synchro-charts/core';
import { getDataBeforeDate } from './dataFilter';
import { getDataPoints } from './getDataPoints';
import { CellItem, Item, ItemRef, TableItem } from './types';

export const createTableItems: (config: {
  dataStreams: DataStream[];
  items: Item[];
  viewport: Viewport;
  thresholds?: Threshold[];
}) => TableItem[] = ({ dataStreams, viewport, items, thresholds = [] }) => {
  return items.map((item) => {
    const keys = Object.keys(item);
    const keyDataPairs = keys.map((key) => {
      if (typeof item[key] === 'object' && Object.prototype.hasOwnProperty.call(item[key], '$cellRef')) {
        const { $cellRef } = item[key] as ItemRef;
        const dataStream = dataStreams.find(({ id }) => id === $cellRef.id);

        if (dataStream) {
          const dataPoints = getDataPoints(dataStream, $cellRef.resolution);
          const { error, isLoading } = dataStream;

          if ('end' in viewport && dataPoints) {
            const point = getDataBeforeDate(dataPoints, viewport.end).pop();
            const value = point?.y;
            const threshold = breachedThreshold({
              dataStream: dataStream as SC_DataStream,
              dataStreams: dataStreams as SC_DataStream[],
              value,
              thresholds,
              date: viewport.end,
            });
            return { key, data: new CellItem({ value, error, isLoading, threshold }) };
          }

          const value = dataPoints.slice(-1)[0]?.y;
          const threshold = breachedThreshold({
            dataStream: dataStream as SC_DataStream,
            dataStreams: dataStreams as SC_DataStream[],
            value,
            thresholds,
            date: new Date(Date.now()),
          });

          return { key, data: new CellItem({ value, error, isLoading, threshold }) };
        }
        return { key, data: new CellItem() };
      }
      return { key, data: new CellItem({ value: item[key] as Primitive }) };
    });

    return keyDataPairs.reduce(
      (previous, { key, data }) => ({
        ...previous,
        [key]: data,
      }),
      {}
    );
  });
};
