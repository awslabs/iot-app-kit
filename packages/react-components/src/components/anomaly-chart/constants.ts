/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  colorBackgroundContainerContent,
  colorBorderControlDefault,
} from '@cloudscape-design/design-tokens';
import { DEFAULT_X_AXIS } from '../../echarts/unboundedZoom/constants';

export const SORT_TRANSFORM = {
  // Transform using echarts so we don't need to care
  // about the format of the data
  transform: [
    {
      type: 'sort',
      config: { dimension: 'timestamp', order: 'asc' },
    },
  ],
};

export const ANOMALY_X_AXIS = {
  xAxis: DEFAULT_X_AXIS,
};

export const ANOMALY_Y_AXIS = {
  type: 'value',
  max: 1,
  min: 0,
  axisLabel: {
    formatter: (value: number) => {
      return `${value * 100}%`;
    },
  },
  axisTick: {
    show: false,
  },
  axisLine: {
    show: false,
  },
  minorTick: {
    show: false,
  },
  nameTextStyle: {
    verticalAlign: 'bottom',
    fontWeight: 'bold',
    padding: [0, 0, 0, 24],
  },
};

export const ANOMALY_GRID = {
  top: 32,
  left: 45,
  right: 15,
  bottom: 0,
};

export const ANOMALY_LEGEND = {
  left: 0,
  bottom: 0,
  height: 35,
  right: 0,
  type: 'scroll',
  selectedMode: false,
};

export const ANOMALY_LEGEND_PADDING = [
  5, // up
  15, // right
  10, // down
  15, // left
];

export const ANOMALY_BAR_SERIES_CONFIGURATION = {
  barMinWidth: 2,
  barMaxWidth: 10,
  sampling: 'lttb',
  stack: 'Total',
  type: 'bar',
  animation: false,
  datasetIndex: 1,
  large: true,
  largeThreshold: 200,
  silent: true,
};

export const ANOMALY_TOOLTIP = {
  trigger: 'axis',
  axisPointer: {
    animation: false,
  },
  showDelay: 25,
  // These only work because the tooltip is rendered as html
  borderColor: colorBorderControlDefault,
  backgroundColor: colorBackgroundContainerContent,
  position: (
    point: [number, number],
    _params: any,
    _dom: any,
    _rect: any,
    size: { viewSize: [number, number]; contentSize: [number, number] }
  ) => {
    return [point[0] + 20, size.viewSize[1] / 2 - 40 - size.contentSize[1] / 2];
  },
};

export const DEFAULT_ANOMALY_WIDGET_SETTINGS = {
  animation: false,
  aria: {
    enabled: true,
  },
  ...ANOMALY_X_AXIS,
};
