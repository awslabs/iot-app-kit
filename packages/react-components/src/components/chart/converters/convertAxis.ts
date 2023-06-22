import { XAXisComponentOption, YAXisComponentOption } from 'echarts';
import { ChartAxisOptions } from '../types';
import { DEFAULT_X_AXIS, DEFAULT_Y_AXIS } from '../eChartsConstants';

export const convertXAxis = (axis: ChartAxisOptions | undefined): XAXisComponentOption => ({
  ...DEFAULT_X_AXIS,
  show: axis?.showX ?? DEFAULT_X_AXIS.show,
});

export const convertYAxis = (axis: ChartAxisOptions | undefined): YAXisComponentOption => ({
  ...DEFAULT_Y_AXIS,
  name: axis?.yAxisLabel,
  show: axis?.showX ?? DEFAULT_Y_AXIS.show,
});
