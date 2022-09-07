import { DataPoint } from '@synchro-charts/core';
import { parseAlarmData } from './parseAlarmData';

export const constructAlarmStreamData = ({ data }: { data: DataPoint[] }): DataPoint[] => {
  return data.map(({ x, y }: DataPoint): DataPoint => {
    if (typeof y === 'string') {
      return { x, y: parseAlarmData(y) };
    }
    return { x, y };
  });
};
