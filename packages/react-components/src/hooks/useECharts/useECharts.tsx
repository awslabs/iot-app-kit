import { useRef, useEffect, MutableRefObject } from 'react';
import { init } from 'echarts';
import type { ECharts } from 'echarts';
import { configureEchartsPlugins } from '../../echarts';

configureEchartsPlugins();

export interface EChartsWrapperProps {
  theme?: string;
}

/**
 * Hook to initialize and attach an echart to the dom
 *
 * @param theme - theme applied to the echarts instance
 * @returns
 *  - ref: React ref to attach to an html element to bind echarts to
 *  - chartRef: ref to an Echarts instance
 */
export const useECharts = (theme?: string) => {
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

  return { chartRef, ref };
};

export type ChartRef = MutableRefObject<ECharts | null>;
