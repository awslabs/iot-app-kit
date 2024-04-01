import { useMemo } from 'react';
import { AnomalyResult } from '../types';
import { L4E_SERIES } from '../constants';

export const useSeries = ({ data }: { data: AnomalyResult[] }) => {
  return useMemo(() => {
    const diagnsoticsByName = data.reduce(
      (
        acc: { [key: string]: [Date, number][] },
        currentEvent: AnomalyResult
      ) => {
        currentEvent.value.diagnostics.forEach((d) => {
          const s = d.name in acc ? acc[d.name] : [];
          acc[d.name] = [...s, [currentEvent.timestamp, d.value * 100]];
        });
        return acc;
      },
      {}
    );

    // create one series for each diagnsotic
    const seriesFromData = [];
    for (const name in diagnsoticsByName) {
      seriesFromData.push({
        name,
        type: 'line',
        step: 'start',
        xAxisIndex: 2,
        yAxisIndex: 2,
        areaStyle: {},
        stack: 'Total',
        data: diagnsoticsByName[name],
      });
    }

    return {
      series: [...L4E_SERIES.series, ...seriesFromData],
    };
  }, [data]);
};
