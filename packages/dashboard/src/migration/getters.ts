import { colorPalette } from '@iot-app-kit/core-util';
import { v4 as uuid } from 'uuid';
import {
  barChartProperties,
  defaultAggregationType,
  lineChartProperties,
  scatterChartProperties,
  timelineProperties,
} from './constants';
import { convertResolution } from './convert-resolution';
import {
  type ForeignWidgetInstance,
  type ForeignWidgetType,
  type MonitorMetric,
} from './types';
import { type TableWidgetProperties } from '~/plugins/table/types';
import { type PartialDeep } from 'type-fest';
import { type StyledAssetPropertyQuery } from '~/plugins/xy-plot/types';

export const getStaticProperties = <WidgetType extends ForeignWidgetType>(
  widgetType: WidgetType
) => {
  switch (widgetType) {
    case 'monitor-line-chart':
      return lineChartProperties;
    case 'monitor-bar-chart':
      return barChartProperties;
    case 'monitor-scatter-chart':
      return scatterChartProperties;
    case 'monitor-status-timeline':
      return timelineProperties;
    case 'monitor-table':
      return {} as const satisfies PartialDeep<TableWidgetProperties>;
    default:
      return lineChartProperties;
  }
};

export const getProperty = (
  metric: MonitorMetric,
  widgetType: ForeignWidgetType,
  index: number
) => {
  let property: StyledAssetPropertyQuery = {
    aggregationType: defaultAggregationType, // Monitor has no aggregationType and application defaults to AVERAGE
    propertyId: metric.propertyId,
    name: metric.label,
    resolution: convertResolution(widgetType, metric.resolution),
  };

  if (
    widgetType === 'monitor-bar-chart' ||
    widgetType === 'monitor-status-timeline' ||
    widgetType === 'monitor-table'
  ) {
    const refId = uuid();
    property = {
      ...property,
      refId,
    };
  } else if (
    widgetType === 'monitor-line-chart' ||
    widgetType === 'monitor-scatter-chart'
  ) {
    const refId = uuid();
    property = {
      ...property,
      refId,
      color: colorPalette[index],
    };
  }
  return property;
};

export const getStyleSettings = (
  widgetType: ForeignWidgetType,
  refIds: string[]
) => {
  let styleSettings = {};

  if (
    widgetType === 'monitor-bar-chart' ||
    widgetType === 'monitor-status-timeline' ||
    widgetType === 'monitor-table'
  ) {
    for (const [index, refId] of refIds.entries()) {
      styleSettings = {
        ...styleSettings,
        [refId]: {
          color: colorPalette[index],
        },
      };
    }

    return styleSettings;
  }
};

export const getKPIAndGridData = (monitorWidget: ForeignWidgetInstance) => {
  const numWidgets = monitorWidget.metrics?.length;
  let widgetHeight = 1;
  let widgetWidth = 1;

  if (numWidgets && numWidgets >= 1 && numWidgets < monitorWidget.width) {
    widgetWidth = Math.floor(monitorWidget.width / numWidgets);
    widgetHeight = monitorWidget.height;
  }

  // max x value is the end of the monitor widget (monitor x + monitor width - (individual widget length))
  const maxXCoord = monitorWidget.x + monitorWidget.width - widgetWidth;

  return {
    widgetWidth,
    widgetHeight,
    maxXCoord,
  };
};
