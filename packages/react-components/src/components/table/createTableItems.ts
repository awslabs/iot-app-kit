import type {
  DataStream,
  Primitive,
  Threshold,
  Viewport,
} from '@iot-app-kit/core';
import { getDataBeforeDate } from '@iot-app-kit/core';
import { breachedThreshold } from '../../utils/breachedThreshold';
import { createCellItem } from './createCellItem';
import { isTableItemRef } from './typePredicates';
import type {
  AlarmItem,
  CellItem,
  TableItem,
  TableItemHydrated,
} from './types';
import type { TableMessages } from './messages';

export const createTableItems: (
  config: {
    dataStreams: DataStream[];
    items: TableItem[];
    viewport: Viewport;
    thresholds?: Threshold[];
    alarms?: AlarmItem[];
  },
  messageOverrides: TableMessages
) => TableItemHydrated[] = (
  { dataStreams, viewport, items, thresholds = [], alarms = [] },
  messageOverrides
) => {
  /**
   * Because alarm items are injected explicitly in
   * the component based on the queries option, we
   * do not need to dynamically map them like we
   * do other items for the table. This is why
   * they are mapped this way below.
   */
  const alarmItemsWithData = alarms.map((alarm) => {
    const isLoading = alarm.isLoading;
    return {
      alarmName: createCellItem(
        {
          value: alarm.alarmName,
          isLoading,
        },
        messageOverrides
      ),
      alarmExpression: createCellItem(
        {
          value: alarm.alarmExpression,
          isLoading,
        },
        messageOverrides
      ),
      alarmState: createCellItem(
        {
          value: alarm.state,
          isLoading,
        },
        messageOverrides
      ),
      property: createCellItem(
        {
          value: alarm.property,
          isLoading,
        },
        messageOverrides
      ),
      alarmSeverity: createCellItem(
        {
          value: alarm.severity,
          isLoading,
        },
        messageOverrides
      ),
      value: createCellItem(
        {
          value: alarm.value,
          isLoading,
        },
        messageOverrides
      ),
      unit: createCellItem(
        {
          value: alarm.unit,
          isLoading,
        },
        messageOverrides
      ),
    };
  });

  const itemsWithData = items.map((item) => {
    const keys = Object.keys(item);
    const keyDataPairs = keys.map<{ key: string; data: CellItem }>((key) => {
      const itemRef = item[key];
      if (isTableItemRef(itemRef)) {
        const { $cellRef } = itemRef;
        const dataStream = dataStreams.find(({ id }) => id === $cellRef.id);

        if (dataStream) {
          const { error, isLoading, data: dataPoints } = dataStream;

          if (dataStream.resolution !== $cellRef.resolution) {
            return {
              key,
              data: createCellItem({ error, isLoading }, messageOverrides),
            };
          }

          if ('end' in viewport && dataPoints) {
            const point = getDataBeforeDate(dataPoints, viewport.end).pop();
            const value = point?.y;
            const quality = point?.quality;
            const threshold = breachedThreshold({
              dataStream,
              dataStreams,
              value,
              thresholds,
              date: viewport.end,
            });
            return {
              key,
              data: createCellItem(
                { value, error, isLoading, threshold, quality },
                messageOverrides
              ),
            };
          }

          const value = dataPoints.slice(-1)[0]?.y;
          const quality = dataPoints.slice(-1)[0]?.quality;
          const threshold = breachedThreshold({
            dataStream,
            dataStreams,
            value,
            thresholds,
            date: new Date(Date.now()),
          });

          return {
            key,
            data: createCellItem(
              { value, error, isLoading, threshold, quality },
              messageOverrides
            ),
          };
        }
        return { key, data: createCellItem({}, messageOverrides) };
      }
      return {
        key,
        data: createCellItem(
          { value: item[key] as Primitive },
          messageOverrides
        ),
      };
    });

    return keyDataPairs.reduce(
      (previous, { key, data }) => ({
        ...previous,
        [key]: data,
      }),
      {}
    );
  });

  return [...alarmItemsWithData, ...itemsWithData];
};
