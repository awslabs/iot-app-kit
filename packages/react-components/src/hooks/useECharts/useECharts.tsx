import { useRef, useEffect } from 'react';
import { init } from 'echarts';
import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts';

export interface EChartsWrapperProps {
  theme?: string;
}

/**
 * 
 * @param { theme } - theme applied to the echarts instance
 * @returns 
 *  - ref: React ref to attach to an html element to bind echarts to
 *  - chartRef: ref to an Echarts instance
 */
export const useECharts = ({ theme }: EChartsWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts | null>(null);

  useEffect(() => {
    if (ref.current) {
      chartRef.current = init(ref.current, theme);
    }

    return () => {
      chartRef.current?.dispose();
    };
  }, [theme]);

  // useEffect(() => {
  //   if (groupId && chartRef.current) {
  //     chartRef.current.group = groupId;
  //   }
  // }, [groupId]);

  // useEffect(() => {
  //   chartRef.current?.setOption(option, settings);
  // }, [chartRef, option, settings]);

  // useEffect(() => {
  //   const chart = chartRef.current;
  //   loading === true ? chart?.showLoading() : chart?.hideLoading();
  // }, [chartRef, loading]);

  // useEffect(() => {
  //   const chart = chartRef.current;
  //   chart?.resize({ width: size.width, height: size.height });
  // }, [chartRef, size]);

  return { chartRef, ref };
};
