import {
  DashboardConfiguration,
  DashboardWidget,
  MigrateDashboard,
} from '../types';
import {
  DashboardWidgetType,
  MonitorWidgetType,
  MonitorMetric,
  SiteWiseMonitorDashboardDefinition,
  MonitorAnnotations,
  MonitorWidget,
  QueryConfig,
  AssetMap,
} from './types';
import { nanoid } from 'nanoid';
import {
  appCellPerMonitorSquareHeight,
  appCellsPerMonitorSquareWidth,
  defaultDisplaySettings,
  defaultResolution,
  minHeight,
  minWidth,
} from './constants';
import {
  getKPIAndGridData,
  getProperty,
  getStaticProperties,
  getStyleSettings,
} from './getters';

const convertType = (monitorChartType: string) => {
  switch (monitorChartType) {
    case MonitorWidgetType.LineChart:
      return DashboardWidgetType.XYPlot;
    case MonitorWidgetType.BarChart:
      return DashboardWidgetType.BarChart;
    case MonitorWidgetType.ScatterChart:
      return DashboardWidgetType.XYPlot;
    case MonitorWidgetType.StatusTimeline:
      return DashboardWidgetType.StatusTimeline;
    case MonitorWidgetType.Table:
      return DashboardWidgetType.Table;
    case MonitorWidgetType.Kpi:
      return DashboardWidgetType.Kpi;
    case MonitorWidgetType.StatusGrid:
      return DashboardWidgetType.Status;
    default:
      return DashboardWidgetType.XYPlot;
  }
};

const convertHeight = (height: number) => {
  // Add some space between widgets by subtracting 0.5
  return Math.max(height * appCellPerMonitorSquareHeight - 0.5, minHeight);
};

const convertWidth = (width: number) => {
  // Add some space between widgets by subtracting 0.5
  return Math.max(width * appCellsPerMonitorSquareWidth - 0.5, minWidth);
};

const convertX = (x: number) => {
  return x * appCellsPerMonitorSquareWidth;
};

const convertY = (y: number) => {
  return y * appCellPerMonitorSquareHeight;
};

export const convertResolution = (
  widgetType: MonitorWidgetType,
  resolution?: string
) => {
  if (
    widgetType === MonitorWidgetType.StatusTimeline ||
    widgetType === MonitorWidgetType.Table
  ) {
    // Timeline has resolution set to 0
    return '0';
  }

  if (resolution) {
    if (resolution === 'raw') {
      return defaultResolution;
    }
    return resolution;
  }
  return defaultResolution;
};

const convertThresholds = (monitorAnnotations?: MonitorAnnotations) => {
  // Annotations are only added to the y axis array in Monitor
  if (monitorAnnotations?.y) {
    const applicationThresholds = [];
    for (const annotation of monitorAnnotations.y) {
      const newThreshold = {
        id: nanoid(12),
        visible: annotation.showValue,
        color: annotation.color,
        value: annotation.value,
        comparisonOperator: annotation.comparisonOperator,
      };
      applicationThresholds.push(newThreshold);
    }

    if (applicationThresholds.length !== 0) {
      return { thresholds: applicationThresholds };
    }
  }
  return undefined;
};

const convertMetricsToQueryConfig = (
  monitorMetrics: MonitorMetric[],
  widgetType: MonitorWidgetType
) => {
  const assetMap: AssetMap = {};
  const refIds = [];

  for (const [index, metric] of monitorMetrics.entries()) {
    const property = getProperty(metric, widgetType, index);

    let newProperties = [property];
    const existingAssetIds = Object.keys(assetMap);

    if (existingAssetIds.includes(metric.assetId)) {
      const existingProperties = assetMap[metric.assetId];
      if (existingProperties) {
        newProperties = [...existingProperties, property];
      }
    }

    // Map each assetId to the array of associated properties
    assetMap[metric.assetId] = newProperties;

    if (property.refId) {
      refIds.push(property.refId);
    }
  }

  const assets = [];
  const assetIds = Object.keys(assetMap);
  for (const assetId of assetIds) {
    const properties = assetMap[assetId];
    if (properties) {
      assets.push({ assetId, properties });
    }
  }

  const queryConfig: QueryConfig = {
    queryConfig: {
      source: 'iotsitewise',
      query: {
        properties: [],
        assets,
      },
    },
  };

  return { queryConfig, refIds };
};

const convertProperties = (
  widgetType: MonitorWidgetType,
  monitorMetrics?: MonitorMetric[],
  monitorAnnotations?: MonitorAnnotations,
  monitorTitle?: string
) => {
  if (monitorMetrics) {
    const staticProperties = getStaticProperties(widgetType);
    const { queryConfig, refIds } = convertMetricsToQueryConfig(
      monitorMetrics,
      widgetType
    );
    const thresholds = convertThresholds(monitorAnnotations);
    const styleSettings = getStyleSettings(widgetType, refIds);

    return {
      ...staticProperties,
      ...queryConfig,
      ...thresholds,
      ...styleSettings,
      title: monitorTitle,
    };
  }
  return getStaticProperties(widgetType);
};

const convertKpiAndGridWidget = (
  monitorWidget: MonitorWidget
): DashboardWidget[] => {
  // For each metric in a monitor widget, create an application widget
  if (monitorWidget.metrics) {
    const appWidgets = [];
    const { widgetWidth, widgetHeight, maxXCoord } =
      getKPIAndGridData(monitorWidget);

    let row = monitorWidget.y;
    let column = monitorWidget.x;

    const rowLength = widgetHeight;
    const columnLength = widgetWidth;

    for (const [index, metric] of monitorWidget.metrics.entries()) {
      const queryConfig: QueryConfig = {
        queryConfig: {
          source: 'iotsitewise',
          query: {
            properties: [],
            assets: [
              {
                assetId: metric.assetId,
                properties: [
                  {
                    propertyId: metric.propertyId,
                    resolution: '0',
                  },
                ],
              },
            ],
          },
        },
      };

      const newAppWidget: DashboardWidget = {
        type: convertType(monitorWidget.type),
        id: nanoid(12),
        x: convertX(column),
        y: convertY(row),
        z: index, // Stack widgets in case of overlap
        width: convertWidth(widgetWidth),
        height: convertHeight(widgetHeight),
        properties: {
          primaryFont: {},
          secondaryFont: {},
          title: monitorWidget.title,
          ...queryConfig,
          showTimestamp: true,
          showAggregationAndResolution: true,
          resolution: '0',
          showUnit: true,
        },
      };
      appWidgets.push(newAppWidget);

      // At end of widget width, reset to row below and start at left-most column
      if (column >= maxXCoord) {
        row = row + rowLength;
        column = monitorWidget.x;
      } else {
        column = column + columnLength;
      }
    }

    return appWidgets;
  }
  return [];
};

export const convertWidget = (
  widget: MonitorWidget,
  index?: number
): DashboardWidget[] => {
  // One-to-many relationship for KPI and Status Timeline in Monitor-to-Application conversion
  if (
    widget.type === MonitorWidgetType.Kpi ||
    widget.type === MonitorWidgetType.StatusGrid
  ) {
    return convertKpiAndGridWidget(widget);
  } else {
    return [
      {
        type: convertType(widget.type),
        id: nanoid(12),
        x: convertX(widget.x),
        y: convertY(widget.y),
        z: index ?? 0, // Stack widgets in case of overlap
        width: convertWidth(widget.width),
        height: convertHeight(widget.height),
        properties: convertProperties(
          widget.type,
          widget.metrics,
          widget.annotations,
          widget.title
        ),
      },
    ];
  }
};

export const migrateDashboard: MigrateDashboard = async (
  params,
  requestFns
) => {
  const newDashboardDefinition: DashboardConfiguration = {
    widgets: [],
    displaySettings: defaultDisplaySettings,
  };
  if (params.dashboardId && requestFns && requestFns.describeDashboard) {
    const response = await requestFns.describeDashboard({
      dashboardId: params.dashboardId,
    });
    const monitorDashboardDefinitionString = response.dashboardDefinition;
    if (monitorDashboardDefinitionString) {
      const monitorDashboardDefinition: SiteWiseMonitorDashboardDefinition =
        JSON.parse(monitorDashboardDefinitionString);
      if (monitorDashboardDefinition.widgets)
        for (const [
          index,
          widget,
        ] of monitorDashboardDefinition.widgets.entries()) {
          newDashboardDefinition.widgets.push(...convertWidget(widget, index));
        }
    }
  }
  return newDashboardDefinition;
};
