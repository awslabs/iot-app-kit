import { colorPalette } from '@iot-app-kit/core-util';
import { v4 as uuid } from 'uuid';
import {
  barChartProperties,
  defaultAggregationType,
  lineChartProperties,
  scatterChartProperties,
  timelineProperties,
} from './constants';
import {
  ApplicationProperty,
  MonitorMetric,
  MonitorWidget,
  MonitorWidgetType,
  SiteWiseWidgetType,
} from './types';
import { convertResolution } from './convert-monitor-to-app-defintion';

export const getStaticProperties = (
  widgetType: MonitorWidgetType | SiteWiseWidgetType
) => {
  switch (widgetType) {
    case MonitorWidgetType.LineChart:
      return lineChartProperties;
    case MonitorWidgetType.BarChart:
      return barChartProperties;
    case MonitorWidgetType.ScatterChart:
      return scatterChartProperties;
    case MonitorWidgetType.StatusTimeline:
      return timelineProperties;
    case MonitorWidgetType.Table:
      return {};
    default:
      return lineChartProperties;
  }
};

export const getProperty = (
  metric: MonitorMetric,
  widgetType: MonitorWidgetType | SiteWiseWidgetType,
  index: number
) => {
  let property: ApplicationProperty = {
    aggregationType: defaultAggregationType, // Monitor has no aggregationType and appliation defaults to AVERAGE
    propertyId: metric.propertyId,
    name: metric.label,
    resolution: convertResolution(widgetType, metric.resolution),
  };

  if (
    widgetType === MonitorWidgetType.BarChart ||
    widgetType === MonitorWidgetType.StatusTimeline ||
    widgetType === MonitorWidgetType.Table
  ) {
    const refId = uuid();
    property = {
      ...property,
      refId,
    };
  } else if (
    widgetType === MonitorWidgetType.LineChart ||
    widgetType === MonitorWidgetType.ScatterChart
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
  widgetType: MonitorWidgetType | SiteWiseWidgetType,
  refIds: string[]
) => {
  let styleSettings = {};
  if (
    widgetType === MonitorWidgetType.BarChart ||
    widgetType === MonitorWidgetType.StatusTimeline ||
    widgetType === MonitorWidgetType.Table
  ) {
    for (const [index, refId] of refIds.entries()) {
      styleSettings = {
        ...styleSettings,
        [refId]: {
          color: colorPalette[index],
        },
      };
    }
    return { styleSettings };
  }
  return undefined;
};

export const getKPIAndGridData = (monitorWidget: MonitorWidget) => {
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
