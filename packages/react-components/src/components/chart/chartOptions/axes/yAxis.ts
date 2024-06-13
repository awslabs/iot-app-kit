import { YAXisComponentOption } from 'echarts';
import { ChartAxisOptions } from '../../types';
import { DEFAULT_Y_AXIS } from '../../eChartsConstants';

export const convertYAxis = (
  axis?: ChartAxisOptions
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
  //TODO: Increased nameGap to solve label collides with y-axis issue, but the issue is in echarts and waiting for this(https://github.com/apache/echarts/issues/9265) CR to be merged from echart team.
  nameGap: 38,
});
