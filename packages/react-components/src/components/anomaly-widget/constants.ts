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

const ANOMALY_X_AXIS = {
  xAxis: DEFAULT_X_AXIS,
};

const ANOMALY_Y_AXIS = {
  yAxis: [
    {
      type: 'value',
      max: 1,
      min: 0,
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
  ],
};

const ANOMALY_GRID = {
  grid: {
    top: 35,
    left: 15,
    right: 15,
    bottom: 50,
  },
};

export const ANOMALY_LEGEND = {
  left: 0,
  bottom: 0,
  height: 35,
  right: 0,
  type: 'scroll',
  selectedMode: false,
};

export const ANOMALY_LEGEND_LOADING_PADDING = [
  5, // up
  42, // right
  10, // down
  15, // left
];
export const ANOMALY_LEGEND_PADDING = [
  5, // up
  15, // right
  10, // down
  15, // left
];

export const ANOMALY_TITLE = {
  id: 'widget-title',
  left: 15,
  top: 10,
  right: 15,
  padding: 0,
};

export const ANOMALY_BAR_SERIES_CONFIGURATION = {
  barMinWidth: 5,
  barMaxWidth: 10,
  stack: 'Total',
  type: 'bar',
  animation: false,
  datasetIndex: 1,
  large: true,
  largeThreshold: 200,
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
  position: (point: [number, number]) => {
    return [point[0] + 20, '0%'];
  },
};

export const DEFAULT_ANOMALY_WIDGET_SETTINGS = {
  animation: false,
  ...ANOMALY_GRID,
  ...ANOMALY_X_AXIS,
  ...ANOMALY_Y_AXIS,
};
