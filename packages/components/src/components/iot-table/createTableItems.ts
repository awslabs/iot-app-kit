import { DataStream, Viewport } from '@iot-app-kit/core';
import { getDataBeforeDate } from '../../ulti/dataFilter';
import { getDataPoints } from '../../ulti/getDataPoints';

export type ItemRef = {
  $cellRef: {
    id: string;
    resolution: number;
  };
};

export type Item = {
  [key in string]: ItemRef | unknown;
};

export const createTableItems = ({
  dataStreams,
  viewport,
  items,
}: {
  dataStreams: DataStream[];
  items: Item[];
  viewport: Viewport;
}) => {
  return items.map((item) => {
    const keys = Object.keys(item);
    const keyValuePairs = keys.map((key) => {
      if (typeof item[key] === 'object' && (item[key] as object).hasOwnProperty('$cellRef')) {
        const { $cellRef } = item[key] as ItemRef;
        const dataStream = dataStreams.find(({ id }) => id === $cellRef.id);

        if (dataStream) {
          const dataPoints = getDataPoints(dataStream, $cellRef.resolution);
          if ('end' in viewport && dataPoints) {
            const point = getDataBeforeDate(dataPoints, viewport.end).pop();
            return { key, value: point?.y };
          } else {
            return { key, value: dataPoints.slice(-1)[0].y };
          }
        }
        return { key, value: undefined };
      }
      return { key, value: item[key] };
    });

    return keyValuePairs.reduce(
      (previousItem, { key, value }) => ({
        ...previousItem,
        [key]: value,
      }),
      {}
    );
  });
};
