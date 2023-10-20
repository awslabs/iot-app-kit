import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useViewport } from '../../../hooks/useViewport';
import { DataZoomComponentOption, EChartsType } from 'echarts';
import { ECHARTS_GESTURE } from '../../../common/constants';
import { DEFAULT_DATA_ZOOM, ECHARTS_ZOOM_DEBOUNCE_MS } from '../eChartsConstants';
import { ViewportInMs } from '../types';
import { Viewport } from '@iot-app-kit/core';
import throttle from 'lodash.throttle';

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

// This hook handles all of the viewport related things, including:
// panning, zooming, live mode
export const useDataZoom = (chartRef: MutableRefObject<EChartsType | null>, viewportInMs: ViewportInMs) => {
  const { lastUpdatedBy, setViewport } = useViewport();
  const [isScrolling, setIsScrolling] = useState(false);

  const viewportInMsRef = useRef(viewportInMs);
  useEffect(() => {
    viewportInMsRef.current = viewportInMs;
  }, [viewportInMs]);

  // handle live mode + pagination
  useEffect(() => {
    const chart = chartRef.current;
    if (chart && !isScrolling) {
      if (viewportInMs.isDurationViewport) {
        // live mode
        setIsScrolling(false);
      }
      chart.setOption({
        dataZoom: { ...DEFAULT_DATA_ZOOM, startValue: viewportInMs.initial, endValue: viewportInMs.end },
      });
    }
    // ignoring because refs dont need to be in dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportInMs, isScrolling, lastUpdatedBy]);

  // create listener for DataZoom events so that all charts can sync up
  useEffect(() => {
    const chart = chartRef?.current;
    if (chart) {
      chart.on('dataZoom', () => {
        throttle(() => {
          setIsScrolling(true);
          onDataZoomEvent(chart, setViewport);
          setIsScrolling(false); //allow for pagination after gesture, will enter the correct branch in above useEffect
        }, ECHARTS_ZOOM_DEBOUNCE_MS)();
      });
    }

    return () => {
      chart?.off('dataZoom');
    };
    // ignoring because refs dont need to be in dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setViewport]);
};
