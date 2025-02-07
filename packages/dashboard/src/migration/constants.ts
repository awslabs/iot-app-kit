import {
  type ForeignWidgetInstance,
  type ForeignWidgetType,
  type MonitorAnnotations,
  type MonitorMetric,
  type WidgetMap,
} from './types';
import { type XYPlotProperties } from '~/plugins/xy-plot/types';
import { type Aggregation } from '~/features/widget-customization/common/aggregation/aggregation-field';
import { type PartialDeep } from 'type-fest';
import { type StatusTimelineProperties } from '~/plugins/status-timeline/types';

export const defaultDisplaySettings = {
  numRows: 100,
  numColumns: 100,
  cellSize: 20,
  significantDigits: 4,
};
export const defaultResolution = '1m';
export const defaultAggregationType: Aggregation = 'AVERAGE';

/**
 * Default Monitor size is 3x3 squares
 * A similar sized application dashboard is 42x24 cells (if cellSize = 20)
 */
export const appCellsPerMonitorSquareWidth = 14; // 42 / 3
export const appCellPerMonitorSquareHeight = 8; // 24 / 3

export const minWidth = appCellsPerMonitorSquareWidth - 0.5;
export const minHeight = appCellPerMonitorSquareHeight - 0.5;

const defaultProperties = {
  aggregationType: defaultAggregationType,
};

export const barChartProperties = {
  ...defaultProperties,
  axis: {
    showY: true,
    showX: true,
  },
};

export const lineChartProperties = {
  ...defaultProperties,
  axis: {
    yVisible: true,
    xVisible: true,
  },
  symbol: {
    style: 'filled-circle',
  },
  line: {
    connectionStyle: 'linear',
    style: 'solid',
  },
  legend: {
    width: '30%',
    visibleContent: {
      unit: true,
      latestValue: true,
      minValue: false,
      asset: true,
      maxValue: false,
    },
    visible: true,
    position: 'right',
    height: '30%',
  },
} as const satisfies PartialDeep<XYPlotProperties>;

export const scatterChartProperties = {
  ...defaultProperties,
  axis: {
    yVisible: true,
    xVisible: true,
  },
  symbol: {
    style: 'filled-circle',
  },
  line: {
    connectionStyle: 'none',
    style: 'solid',
  },
  legend: {
    visible: true,
  },
} as const satisfies PartialDeep<XYPlotProperties>;

export const timelineProperties = {
  axis: {
    showY: true,
    showX: true,
  },
} as const satisfies PartialDeep<StatusTimelineProperties>;

export const createMonitorChartWidget = (
  widgetType: ForeignWidgetType,
  metrics: MonitorMetric[],
  annotations?: MonitorAnnotations,
  title?: string,
  x?: number,
  y?: number
): ForeignWidgetInstance<WidgetMap[ForeignWidgetType]> => {
  return {
    type: widgetType,
    title: title ?? 'test',
    x: x ?? 0,
    y: y ?? 0,
    height: 3,
    width: 3,
    metrics,
    alarms: [],
    properties: {
      colorDataAcrossThresholds: true,
    },
    annotations,
  };
};

export const createApplicationChartDefinition = (
  widgetType: string,
  properties: object,
  height = 23.5,
  width = 41.5,
  x = 0,
  y = 0,
  z = 0
) => {
  return {
    type: widgetType,
    x,
    y,
    z,
    width,
    height,
    properties,
  };
};

export const metrics = [
  {
    type: 'iotsitewise',
    label: 'Total Average Power (Demo Wind Farm Asset)',
    assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
    propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
    dataType: 'DOUBLE',
  },
];

export const expectedProperties = {
  title: 'test',
  symbol: {
    style: 'filled-circle',
  },
  axis: {
    yVisible: true,
    xVisible: true,
  },
  line: {
    connectionStyle: 'linear',
    style: 'solid',
  },
  legend: {
    visible: true,
  },
  queryConfig: {
    source: 'iotsitewise',
    query: {
      properties: [],
      assets: [
        {
          assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
          properties: [
            {
              aggregationType: 'AVERAGE',
              propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
              resolution: '1m',
            },
          ],
        },
      ],
    },
  },
};
