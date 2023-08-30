import { MutableRefObject, useEffect } from 'react';
import { useViewport } from '../../../hooks/useViewport';
import { EChartsType } from 'echarts';
import { ECHARTS_GESTURE } from '../../../common/constants';

// adds event handlers in order to sync echart's dataZoom event with nono-echarts widgets
export const useDataZoomListeners = (chartRef: MutableRefObject<EChartsType | null>) => {
  const { setViewport } = useViewport();

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      // known bug with zooming into live data https://github.com/apache/echarts/issues/11679
      // this will prevent the data from moving if we are zoomed in
      chart.on('dataZoom', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const currentDataZoom = chart.getOption().dataZoom[0];

        const newDataZoom = {};
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        currentDataZoom.start > 0 ? (newDataZoom.startValue = currentDataZoom.startValue) : (newDataZoom.start = 0);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        currentDataZoom.end < 100 ? (newDataZoom.endValue = currentDataZoom.endValue) : (newDataZoom.end = 100);

        setViewport(
          { start: new Date(currentDataZoom.startValue), end: new Date(currentDataZoom.endValue) },
          ECHARTS_GESTURE
        );
        chart.setOption(
          {
            dataZoom: newDataZoom,
          },
          { lazyUpdate: true }
        );
      });
    }
  }, [chartRef]);
};
