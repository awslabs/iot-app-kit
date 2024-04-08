import { useEffect } from 'react';
import { ChartRef } from '../../../hooks/useECharts';
import { DEFAULT_ANOMALY_WIDGET_SETTINGS } from '../constants';

export const useSetOptions = ({
  chartRef,
  customOptions,
}: {
  chartRef: ChartRef;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customOptions: any;
}) => {
  useEffect(() => {
    const anomaly = chartRef.current;
    // set default chart options
    anomaly?.setOption({ ...DEFAULT_ANOMALY_WIDGET_SETTINGS });
  });

  useEffect(() => {
    const anomaly = chartRef.current;
    // set customOptions, which will merge with default options set above
    anomaly?.setOption({ ...customOptions });
  }, [chartRef, customOptions]);
};
