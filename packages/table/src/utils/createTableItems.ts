import { Viewport, DataStream } from '@iot-app-kit/core';
import { breachedThreshold, Primitive, Threshold, DataStream as SynchroChartsDataStream } from '@synchro-charts/core';
import { getDataBeforeDate } from './dataFilters';
import { getDataPoints } from './getDataPoints';
import { CellItem, Item, ItemRef, TableItem } from './types';
import { createCellItem } from './createCellItem';
import { TableMessages } from './messages';

export const createTableItems: (
  config: {
    dataStreams: DataStream[];
    items: Item[];
    viewport: Viewport;
    thresholds?: Threshold[];
  },
  messageOverrides: TableMessages
) => TableItem[] = ({ dataStreams, viewport, items, thresholds = [] }, messageOverrides) => {
  return items.map((item) => {
    const keys = Object.keys(item);
    const keyDataPairs = keys.map<{ key: string; data: CellItem }>((key) => {
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
              dataStream: dataStream as SynchroChartsDataStream,
              dataStreams: dataStreams as SynchroChartsDataStream[],
              value,
              thresholds,
              date: viewport.end,
            });
            return { key, data: createCellItem({ value, error, isLoading, threshold }, messageOverrides) };
          }

          const value = dataPoints.slice(-1)[0]?.y;
          const threshold = breachedThreshold({
            dataStream: dataStream as SynchroChartsDataStream,
            dataStreams: dataStreams as SynchroChartsDataStream[],
            value,
            thresholds,
            date: new Date(Date.now()),
          });

          return { key, data: createCellItem({ value, error, isLoading, threshold }, messageOverrides) };
        }
        return { key, data: createCellItem({}, messageOverrides) };
      }
      return { key, data: createCellItem({ value: item[key] as Primitive }, messageOverrides) };
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
