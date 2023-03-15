import type { DataStream, Primitive, Threshold, Viewport } from '@iot-app-kit/core';
import { getDataBeforeDate } from '@iot-app-kit/core';
import { breachedThreshold } from '../../utils/breachedThreshold';
import { getDataPoints } from '../../utils/getDataPoints';
import { createCellItem } from './createCellItem';
import { isTableItemRef } from './typePredicates';
import type { CellItem, TableItem, TableItemHydrated } from './types';
import type { TableMessages } from './messages';

export const createTableItems: (
  config: {
    dataStreams: DataStream[];
    items: TableItem[];
    viewport: Viewport;
    thresholds?: Threshold[];
  },
  messageOverrides: TableMessages
) => TableItemHydrated[] = ({ dataStreams, viewport, items, thresholds = [] }, messageOverrides) => {
  return items.map((item) => {
    const keys = Object.keys(item);
    const keyDataPairs = keys.map<{ key: string; data: CellItem }>((key) => {
      const itemRef = item[key];
      if (isTableItemRef(itemRef)) {
        const { $cellRef } = itemRef;
        const dataStream = dataStreams.find(({ id }) => id === $cellRef.id);

        if (dataStream) {
          const dataPoints = getDataPoints(dataStream, $cellRef.resolution);
          const { error, isLoading } = dataStream;

          if ('end' in viewport && dataPoints) {
            const point = getDataBeforeDate(dataPoints, viewport.end).pop();
            const value = point?.y;
            const threshold = breachedThreshold({
              dataStream,
              dataStreams,
              value,
              annotations: { y: thresholds },
              date: viewport.end,
            });
            return { key, data: createCellItem({ value, error, isLoading, threshold }, messageOverrides) };
          }

          const value = dataPoints.slice(-1)[0]?.y;
          const threshold = breachedThreshold({
            dataStream,
            dataStreams,
            value,
            annotations: { y: thresholds },
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
