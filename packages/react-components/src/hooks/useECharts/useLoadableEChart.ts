import { useEffect } from 'react';
import type { ECharts } from 'echarts';

/**
 * hook to toggle loading on an echarts instance
 *
 * @param chartRef React ref to an initialized echarts object
 * @param loading - whether or not to set the loading animation on an echart
 * @returns void
 */
export const useLoadableEChart = (
  chartRef: React.MutableRefObject<ECharts | null>,
  loading?: boolean
) => {
  useEffect(() => {
    const chart = chartRef.current;
    loading === true ? chart?.showLoading() : chart?.hideLoading();
  }, [chartRef, loading]);
};
