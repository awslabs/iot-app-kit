import { useEffect } from 'react';
import { ChartRef } from '../../../hooks/useECharts';
import { AnomalyResult } from '../types';

export const useSetDataSet = ({
  chartRef,
  data,
}: {
  chartRef: ChartRef;
  data: AnomalyResult[];
}) => {
  useEffect(() => {
    const mappedEvents = data.map((ev) => [ev.timestamp, 100, ev.value]);
    chartRef.current?.setOption({
      dataset: {
        dimensions: ['time', 'value', 'extraData'],
        source: mappedEvents,
      },
    });
  }, [chartRef, data]);
};
