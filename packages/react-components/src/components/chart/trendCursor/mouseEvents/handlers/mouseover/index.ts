import { MutableRefObject } from 'react';
import { ECharts } from 'echarts';
import { MAX_TREND_CURSORS } from '../../../constants';
import { InternalGraphicComponentGroupOption } from '../../../types';

export const mouseoverHandler = (
  isInCursorAddMode: boolean,
  tcGraphicList: InternalGraphicComponentGroupOption[],
  chartRef: MutableRefObject<ECharts | null>
) => {
  if (isInCursorAddMode && tcGraphicList.length < MAX_TREND_CURSORS) {
    chartRef.current?.getZr().setCursorStyle('crosshair');
  }
};
