import { useEffect } from 'react';
import { ChartRef } from '../../../hooks/useECharts';

export const useResizableGauge = (
  chartRef: ChartRef,
  size?: { width: number; height: number }
) => {
  useEffect(() => {
    const chart = chartRef.current;
    chart?.resize({
      width: size?.width,
      height: size?.height,
    });
  }, [size, chartRef]);
};
