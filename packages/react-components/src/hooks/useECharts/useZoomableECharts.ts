import { useRef, useEffect, MutableRefObject, useState } from 'react';
import { init, connect, disconnect } from 'echarts';
import type { ECharts } from 'echarts';
import {
  configureEchartsPlugins,
  registerCloudscapeThemes,
} from '../../echarts';
import { useUnboundedDataZoom } from '../../echarts/unboundedZoom';
import { Viewport } from '@iot-app-kit/core';
import { useViewport } from '../useViewport';

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
export const useZoomableECharts = ({
  theme,
  viewport,
}: {
  theme?: string;
  viewport?: Viewport;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts | null>(null);
  const [chart, setChart] = useState<ECharts | null>(null);

  const { group } = useViewport();

  useEffect(() => {
    if (group && chart) {
      chart.group = group;
      disconnect(group);
      connect(group);
    }
  }, [group, chart]);

  useEffect(() => {
    if (ref.current) {
      registerCloudscapeThemes();

      chartRef.current = init(ref.current, theme, {
        renderer:
          localStorage.getItem('USE_SVG_FOR_ECHARTS_PLAYWRIGHT_TEST_ONLY') ===
          'true'
            ? 'svg'
            : 'canvas',
      });
      setChart(chartRef.current);
    }

    return () => {
      setChart(null);
      chartRef.current?.dispose();
    };
  }, [theme]);

  useUnboundedDataZoom({ chart, viewport });

  return { chartRef, ref };
};

export type ChartRef = MutableRefObject<ECharts | null>;
