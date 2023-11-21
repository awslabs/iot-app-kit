import { MutableRefObject, useEffect, useRef } from 'react';
import { useViewport } from '../../../hooks/useViewport';
import { DataZoomComponentOption, EChartsType } from 'echarts';
import { ECHARTS_GESTURE } from '../../../common/constants';
import { DEFAULT_DATA_ZOOM } from '../eChartsConstants';
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

// This hook handles all of the viewport related things, including:
// panning, zooming, live mode
export const useDataZoom = (chartRef: MutableRefObject<EChartsType | null>, viewportInMs: ViewportInMs) => {
  const { setViewport } = useViewport();

  const isViewportChangeAnimationPausedRef = useRef(false);
  const pauseViewportChangeAnimation = () => (isViewportChangeAnimationPausedRef.current = true);
  const unpauseViewportChangeAnimation = () => (isViewportChangeAnimationPausedRef.current = false);

  // Animate viewport changes
  useEffect(() => {
    const chart = chartRef.current;
    const isViewportChangeAnimationPaused = isViewportChangeAnimationPausedRef.current;

    if (!isViewportChangeAnimationPaused) {
      chart?.setOption({
        dataZoom: { ...DEFAULT_DATA_ZOOM, startValue: viewportInMs.initial, endValue: viewportInMs.end },
      });
    }
  }, [chartRef, isViewportChangeAnimationPausedRef, viewportInMs.initial, viewportInMs.end]);

  // Subscribe to events
  useEffect(() => {
    const chart = chartRef.current;
    let frame: number;

    chart?.on('dataZoom', () => {
      pauseViewportChangeAnimation();

      // Synchronize animation with refresh rate
      frame = requestAnimationFrame(() => {
        onDataZoomEvent(chart, setViewport);
      });
    });

    chart?.on('finished', unpauseViewportChangeAnimation);

    return () => {
      chart?.off('dataZoom');
      chart?.off('finished', unpauseViewportChangeAnimation);
      cancelAnimationFrame(frame);
    };
  }, [setViewport, chartRef, isViewportChangeAnimationPausedRef]);
};
