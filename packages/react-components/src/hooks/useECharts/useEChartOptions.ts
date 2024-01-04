import { useEffect } from 'react';
import type { ECharts, EChartsOption, SetOptionOpts } from 'echarts';

/**
 *
 * hook to update options on an echarts instance
 *
 * @param chartRef React ref to an initialized echarts object
 * @param option - set options on an echarts instance
 * @param settings - settings to be used when setting an option
 * @returns void
 */
export const useEChartOptions = (
  chartRef: React.MutableRefObject<ECharts | null>,
  option: EChartsOption,
  settings?: SetOptionOpts
) => {
  const optionString = JSON.stringify(option);
  const settingsString = JSON.stringify(settings);

  useEffect(() => {
    chartRef.current?.setOption(option, settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, optionString, settingsString]);
};
