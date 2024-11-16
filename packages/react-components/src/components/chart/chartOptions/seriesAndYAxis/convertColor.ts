import { type LineSeriesOption } from 'echarts';
import {
  BAD_DATA_ICON_COLOR,
  UNCERTAIN_DATA_ICON_COLOR,
} from '../../eChartsConstants';
import { type DataPoint } from '@iot-app-kit/core';
import { type ChartDataQuality } from '../../types';

export type ConvertColorOptions = { color?: string } & ChartDataQuality;
export const convertColor = ({
  color = '',
  showBadDataIcons,
  showUncertainDataIcons,
}: ConvertColorOptions): LineSeriesOption['itemStyle'] => ({
  color: (params) => {
    const quality = (params.data as DataPoint | undefined)?.quality;

    if (showUncertainDataIcons && quality === 'UNCERTAIN') {
      return UNCERTAIN_DATA_ICON_COLOR;
    } else if (showBadDataIcons && quality === 'BAD') {
      return BAD_DATA_ICON_COLOR;
    }

    return color;
  },
});
