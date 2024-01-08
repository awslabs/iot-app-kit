import { parseAlarmData } from './parseAlarmData';
import type { DataPoint } from '@iot-app-kit/core';

export const constructAlarmStreamData = ({
  data,
}: {
  data: DataPoint[];
}): DataPoint[] => {
  return data.map(({ x, y }: DataPoint): DataPoint => {
    if (typeof y === 'string') {
      return { x, y: parseAlarmData(y) };
    }
    return { x, y };
  });
};
