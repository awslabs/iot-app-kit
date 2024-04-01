import { useEffect } from 'react';
import { ChartRef } from '../../../hooks/useECharts';
import { DEFAULT_L4E_WIDGET_SETTINGS } from '../constants';

export const useSetOptions = ({
  chartRef,
  customOptions,
}: {
  chartRef: ChartRef;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customOptions: any;
}) => {
  useEffect(() => {
    const l4e = chartRef.current;
    // set default chart options
    l4e?.setOption({ ...DEFAULT_L4E_WIDGET_SETTINGS });
  });

  useEffect(() => {
    const l4e = chartRef.current;
    // set customOptions, which will merge with default options set above
    l4e?.setOption({ ...customOptions });
  }, [chartRef, customOptions]);
};
