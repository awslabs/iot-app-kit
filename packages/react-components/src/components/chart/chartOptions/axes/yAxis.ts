import { YAXisComponentOption } from 'echarts';
import { ChartAxisOptions } from '../../types';
import { DEFAULT_Y_AXIS } from '../../eChartsConstants';

export const convertYAxis = (
  axis: ChartAxisOptions | undefined
): YAXisComponentOption => ({
  ...DEFAULT_Y_AXIS,
  name: axis?.yLabel,
  show: axis?.showY ?? DEFAULT_Y_AXIS.show,
  min: axis?.yMin ?? undefined,
  max: axis?.yMax ?? undefined,
  type: 'value',
  scale: true,
  axisLabel: {
    hideOverlap: true,
    color: '#5f6b7a',
  },
  nameLocation: 'middle',
  nameGap: 30,
});
