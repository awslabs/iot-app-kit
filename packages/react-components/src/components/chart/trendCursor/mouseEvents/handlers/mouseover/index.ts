import { MutableRefObject } from 'react';
import { ECharts } from 'echarts';

export const mouseoverHandler = (isInCursorAddMode: boolean, chartRef: MutableRefObject<ECharts | null>) => {
  if (isInCursorAddMode) {
    chartRef.current?.getZr().setCursorStyle('crosshair');
  }
};
