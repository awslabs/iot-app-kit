import { useEffect } from 'react';
import { ChartRef } from '../../../hooks/useECharts';

export const useSetXAxis = ({
  chartRef,
  viewportStart,
  viewportEnd,
}: {
  chartRef: ChartRef;
  viewportStart?: Date;
  viewportEnd?: Date;
}) => {
  useEffect(() => {
    const l4e = chartRef.current;
    const customXAxis =
      viewportStart && viewportEnd
        ? [
            {
              name: 'l4e-timeline-axis',
              min: viewportStart.getTime(),
              max: viewportEnd.getTime(),
            },
            {
              name: 'l4e-selection-axis',
              min: viewportStart.getTime(),
              max: viewportEnd.getTime(),
            },
          ]
        : undefined;
    l4e?.setOption({ xAxis: customXAxis });
  }, [chartRef, viewportStart, viewportEnd]);
};
