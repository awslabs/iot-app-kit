import { MutableRefObject, useEffect, useState } from 'react';
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
    !!allDataZooms.length &&
      setViewport(
        { start: new Date(allDataZooms[0].startValue || 0), end: new Date(allDataZooms[0].endValue || 0) },
        ECHARTS_GESTURE
      );
  }
};

export const useDataZoom = (chartRef: MutableRefObject<EChartsType | null>, viewportInMs: ViewportInMs) => {
  const { lastUpdatedBy, setViewport } = useViewport();
  const [isScrolling, setIsScroling] = useState(false);

  // handle live mode
  useEffect(() => {
    const chart = chartRef.current;
    if (chart && (!isScrolling || lastUpdatedBy === 'date-picker')) {
      setIsScroling(false);
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
        setIsScroling(true);
        onDataZoomEvent(chart, setViewport);
      });
    }
    return () => {
      chart?.off('dataZoom');
      return;
    };
  }, [chartRef]);
};
