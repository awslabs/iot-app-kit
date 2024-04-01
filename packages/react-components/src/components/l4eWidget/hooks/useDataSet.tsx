import { useMemo } from 'react';
import { AnomalyResult } from '../types';

export const useDataSet = ({ data }: { data: AnomalyResult[] }) => {
  return useMemo(() => {
    const mappedEvents = data.map((ev) => [ev.timestamp, 100, ev.value]);
    return {
      dataset: {
        dimensions: ['time', 'value', 'extraData'],
        source: mappedEvents,
      },
    };
  }, [data]);
};
