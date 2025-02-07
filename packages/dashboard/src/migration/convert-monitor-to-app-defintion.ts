import { nanoid } from 'nanoid';
import { removeCollisions } from './collision-logic';
import {
  appCellPerMonitorSquareHeight,
  appCellsPerMonitorSquareWidth,
  defaultDisplaySettings,
  minHeight,
  minWidth,
} from './constants';
import {
  getKPIAndGridData,
  getProperty,
  getStaticProperties,
  getStyleSettings,
} from './getters';
import {
  type AssetMap,
  type ForeignDashboardDefinition,
  type ForeignWidgetInstance,
  type ForeignWidgetType,
  isMappedToWidget,
  type MonitorAnnotations,
  type MonitorMetric,
  type ReverseWidgetMap,
  type WidgetMap,
  widgetMap,
} from './types';
import { type WidgetInstance } from '~/features/widget-instance/instance';
import { type SiteWiseQueryConfig } from '~/features/queries/queries';
import { type MigrateDashboard } from '~/types';
import { type DashboardConfiguration } from '~/features/dashboard-configuration/dashboard-configuration';
import { type RegisteredWidgetPlugins } from '~/features/widget-plugins/registry';

const convertHeight = (height: number) => {
  // Add some space between widget-instance by subtracting 0.5
  return Math.max(height * appCellPerMonitorSquareHeight - 0.5, minHeight);
};

const convertWidth = (width: number) => {
  // Add some space between widget-instance by subtracting 0.5
  return Math.max(width * appCellsPerMonitorSquareWidth - 0.5, minWidth);
};

const convertX = (x: number) => {
  return x * appCellsPerMonitorSquareWidth;
};

const convertY = (y: number) => {
  return y * appCellPerMonitorSquareHeight;
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
  widgetType: ForeignWidgetType
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

  const assets: NonNullable<SiteWiseQueryConfig['query']>['assets'] = [];
  const assetIds = Object.keys(assetMap);
  for (const assetId of assetIds) {
    const properties = assetMap[assetId];
    if (properties) {
      assets.push({ assetId, properties });
    }
  }

  const queryConfig: SiteWiseQueryConfig = {
    source: 'iotsitewise',
    query: {
      properties: [],
      assets,
    },
  };

  return { queryConfig, refIds };
};

const convertProperties = <WidgetType extends ForeignWidgetType>(
  widgetType: WidgetType,
  monitorMetrics?: MonitorMetric[],
  monitorAnnotations?: MonitorAnnotations,
  monitorTitle?: string
): RegisteredWidgetPlugins[WidgetMap[WidgetType]]['properties'] => {
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
    } as RegisteredWidgetPlugins[WidgetMap[WidgetType]]['properties'];
  }

  return getStaticProperties(widgetType);
};

const convertKpiAndGridWidget = (
  foreignWidget: ForeignWidgetInstance<'kpi'>
): WidgetInstance<'kpi'>[] => {
  const kpiWidgets: WidgetInstance<'kpi'>[] = [];

  // For each metric in a monitor widget, create an application widget
  if (foreignWidget.metrics) {
    const { widgetWidth, widgetHeight, maxXCoord } =
      getKPIAndGridData(foreignWidget);

    let row = foreignWidget.y;
    let column = foreignWidget.x;

    const rowLength = widgetHeight;
    const columnLength = widgetWidth;

    for (const [index, metric] of foreignWidget.metrics.entries()) {
      const queryConfig: SiteWiseQueryConfig = {
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
      };

      const newAppWidget: WidgetInstance<'kpi'> = {
        type: widgetMap[foreignWidget.type],
        id: nanoid(12),
        x: convertX(column),
        y: convertY(row),
        z: index, // Stack widget-instance in case of overlap
        width: convertWidth(widgetWidth),
        height: convertHeight(widgetHeight),
        properties: {
          primaryFont: {},
          secondaryFont: {},
          title: foreignWidget.title,
          ...queryConfig,
          showTimestamp: true,
          showAggregationAndResolution: true,
          showUnit: true,
        },
      };
      kpiWidgets.push(newAppWidget);

      // At end of widget width, reset to row below and start at left-most column
      if (column >= maxXCoord) {
        row = row + rowLength;
        column = foreignWidget.x;
      } else {
        column = column + columnLength;
      }
    }
  }

  return kpiWidgets;
};

export const convertWidget = <WidgetType extends keyof ReverseWidgetMap>(
  widget: ForeignWidgetInstance<WidgetType>,
  index?: number
): WidgetInstance<WidgetType>[] => {
  const widgetType = widgetMap[widget.type];
  // One-to-many relationship for KPI and Status Timeline in Monitor-to-Application conversion
  //if (widgetMap[widget.type] === 'kpi') {
  if (isMappedToWidget('kpi', widget)) {
    return convertKpiAndGridWidget(widget) as WidgetInstance<WidgetType>[];
  } else {
    const properties = convertProperties(
      widget.type,
      widget.metrics,
      widget.annotations,
      widget.title
    ) as WidgetInstance<WidgetType>['properties'];

    return [
      {
        type: widgetType,
        id: nanoid(12),
        x: convertX(widget.x),
        y: convertY(widget.y),
        z: index ?? 0, // Stack widget-instance in case of overlap
        width: convertWidth(widget.width),
        height: convertHeight(widget.height),
        properties,
      } as WidgetInstance<WidgetType>,
    ];
  }
};

export const migrateDashboard: MigrateDashboard = async ({
  parameters,
  iotSiteWiseClient,
}) => {
  const newDashboardDefinition: DashboardConfiguration = {
    widgets: [],
    displaySettings: defaultDisplaySettings,
  };
  if (
    parameters.dashboardId &&
    iotSiteWiseClient &&
    iotSiteWiseClient.describeDashboard
  ) {
    const response = await iotSiteWiseClient.describeDashboard({
      dashboardId: parameters.dashboardId,
    });
    const monitorDashboardDefinitionString = response.dashboardDefinition;
    if (monitorDashboardDefinitionString) {
      const monitorDashboardDefinition: ForeignDashboardDefinition = JSON.parse(
        // sitewise dashboards with custom property names add a new line to the end of the string,
        // which was erroring in JSON.parse. ex: "label":"Custom Name\n" would throw the error
        // "JSON.parse: bad control character in string literal"

        // eslint-disable-next-line no-control-regex
        monitorDashboardDefinitionString.replace(/[\u0000-\u0019]+/g, '')
      );
      if (monitorDashboardDefinition.widgets) {
        // run collision algorithm to remove overlaps
        monitorDashboardDefinition.widgets = removeCollisions(
          monitorDashboardDefinition.widgets
        );
        for (const [
          index,
          widget,
        ] of monitorDashboardDefinition.widgets.entries()) {
          newDashboardDefinition.widgets.push(...convertWidget(widget, index));
        }
      }
    }
  }
  return newDashboardDefinition;
};
