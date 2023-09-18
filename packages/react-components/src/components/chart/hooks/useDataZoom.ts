import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useViewport } from '../../../hooks/useViewport';
import { DataZoomComponentOption, EChartsType } from 'echarts';
import { ECHARTS_GESTURE } from '../../../common/constants';
import { DEFAULT_DATA_ZOOM, ECHARTS_ZOOM_DEBOUNCE_MS } from '../eChartsConstants';
import { ViewportInMs } from '../types';
import { Viewport } from '@iot-app-kit/core';

// known bug with zooming into live data https://github.com/apache/echarts/issues/11679
// this function will prevent the data from moving if we are zoomed in
const onDataZoomEvent = (chart: EChartsType, setViewport: (viewport: Viewport, lastUpdatedBy?: string) => void) => {
  if (chart) {
    const allDataZooms = chart.getOption().dataZoom as DataZoomComponentOption[];
    if (allDataZooms.length) {
      setViewport(
        { start: new Date(allDataZooms[0].startValue || 0), end: new Date(allDataZooms[0].endValue || 0) },
        ECHARTS_GESTURE
      );
    }
  }
};
// this variable has to live in the global namespace else debounce will not work
let debounceTimer: NodeJS.Timeout | null = null;
const debounceZoom = (func: (...args: unknown[]) => void, delay: number) => {
  return (...args: unknown[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      func.call(null, ...args);
    }, delay);
  };
};

export const useDataZoom = (chartRef: MutableRefObject<EChartsType | null>, viewportInMs: ViewportInMs) => {
  const { lastUpdatedBy, setViewport } = useViewport();
  const [isScrolling, setIsScrolling] = useState(false);

  const viewportInMsRef = useRef(viewportInMs);
  useEffect(() => {
    viewportInMsRef.current = viewportInMs;
  }, [viewportInMs]);

  // handle live mode
  useEffect(() => {
    const chart = chartRef.current;
    if (chart && (!isScrolling || lastUpdatedBy === 'date-picker')) {
      setIsScrolling(false);
      chart.setOption({
        dataZoom: { ...DEFAULT_DATA_ZOOM, startValue: viewportInMs.initial, end: 100 },
      });
    }
  }, [chartRef, viewportInMs, isScrolling]);

  // create listener for DataZoom events so that all charts can sync up
  useEffect(() => {
    const chart = chartRef?.current;
    if (chart) {
      chart.on('dataZoom', () => {
        debounceZoom(() => {
          setIsScrolling(true);
          onDataZoomEvent(chart, setViewport);
        }, ECHARTS_ZOOM_DEBOUNCE_MS)();
      });
    }

    return () => {
      chart?.off('dataZoom');
    };
  }, [chartRef]);
};
