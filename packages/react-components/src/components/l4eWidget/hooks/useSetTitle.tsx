import { useEffect } from 'react';
import { ChartRef } from '../../../hooks/useECharts';

export const useSetTitle = ({
  chartRef,
  title,
}: {
  chartRef: ChartRef;
  title?: string;
}) => {
  useEffect(() => {
    const l4e = chartRef.current;
    l4e?.setOption({ title: { text: title } });
  }, [chartRef, title]);
};
