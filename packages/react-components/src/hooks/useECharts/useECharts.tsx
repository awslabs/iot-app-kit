import { useRef, useEffect } from 'react';
import { init } from 'echarts';
import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts';

export interface EChartsWrapperProps {
  option: EChartsOption;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: string;
  className?: string;
  size?: { width?: number; height?: number };
}

export const useECharts = ({ option, settings, loading, theme, size = {} }: EChartsWrapperProps) => {
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

  useEffect(() => {
    chartRef.current?.setOption(option, settings);
  }, [chartRef, option, settings]);

  useEffect(() => {
    const chart = chartRef.current;
    loading === true ? chart?.showLoading() : chart?.hideLoading();
  }, [chartRef, loading]);

  useEffect(() => {
    const chart = chartRef.current;
    chart?.resize({ width: size.width, height: size.height });
  }, [chartRef, size]);

  return { chartRef, ref };
};
