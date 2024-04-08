import { useMemo } from 'react';
import { ANOMALY_SERIES } from '../constants';
import { AnomalyDescription } from '../../../data';

export const useSeries = ({
  description,
}: {
  description: AnomalyDescription | undefined;
}) => {
  return useMemo(() => {
    if (!description) {
      return {
        series: [...ANOMALY_SERIES.series],
      };
    }
    const diagnosticSeries = description.diagnostics.map((d) => {
      return {
        id: d.id,
        name: d.name,
        encode: {
          x: 'timestamp',
          y: d.id,
        },
        type: 'line',
        step: 'start',
        xAxisIndex: 1,
        yAxisIndex: 1,
        datasetIndex: 1,
        areaStyle: {},
        stack: 'Total',
      };
    });

    return {
      series: [...ANOMALY_SERIES.series, ...diagnosticSeries],
    };
  }, [description]);
};
