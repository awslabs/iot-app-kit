import { XY_PLOT_WIDGET_TYPE as IAK_XY_PLOT_TYPE } from '~/plugins/xy-plot/constants';
import { BAR_CHART_WIDGET_TYPE as IAK_BAR_CHART_TYPE } from '~/plugins/bar-chart/constants';
import { KPI_WIDGET_TYPE as IAK_KPI_TYPE } from '~/plugins/kpi/constants';
import { STATUS_TIMELINE_WIDGET_TYPE as IAK_STATUS_TIMELINE_TYPE } from '~/plugins/status-timeline/constants';
import { TABLE_WIDGET_TYPE as IAK_TABLE_TYPE } from '~/plugins/table/constants';
import { type AssetPropertyQuery } from '@iot-app-kit/source-iotsitewise';

const SC_LINE_CHART_TYPE = 'sc-line-chart';
const SC_SCATTER_CHART_TYPE = 'sc-scatter-chart';
const SC_BAR_CHART_TYPE = 'sc-bar-chart';
const SC_KPI_TYPE = 'sc-kpi';
const SC_STATUS_GRID_TYPE = 'sc-status-grid';
const SC_STATUS_TIMELINE_TYPE = 'sc-status-timeline';
const SC_TABLE_TYPE = 'sc-table';

const MONITOR_LINE_CHART_TYPE = 'monitor-line-chart';
const MONITOR_SCATTER_CHART_TYPE = 'monitor-scatter-chart';
const MONITOR_BAR_CHART_TYPE = 'monitor-bar-chart';
const MONITOR_KPI_TYPE = 'monitor-kpi';
const MONITOR_STATUS_GRID_TYPE = 'monitor-status-grid';
const MONITOR_STATUS_TIMELINE_TYPE = 'monitor-status-timeline';
const MONITOR_TABLE_TYPE = 'monitor-table';

export const widgetMap = {
  [SC_LINE_CHART_TYPE]: IAK_XY_PLOT_TYPE,
  [SC_SCATTER_CHART_TYPE]: IAK_XY_PLOT_TYPE,
  [SC_BAR_CHART_TYPE]: IAK_BAR_CHART_TYPE,
  [SC_KPI_TYPE]: IAK_KPI_TYPE,
  [SC_STATUS_GRID_TYPE]: IAK_KPI_TYPE,
  [SC_STATUS_TIMELINE_TYPE]: IAK_STATUS_TIMELINE_TYPE,
  [SC_TABLE_TYPE]: IAK_TABLE_TYPE,

  [MONITOR_LINE_CHART_TYPE]: IAK_XY_PLOT_TYPE,
  [MONITOR_SCATTER_CHART_TYPE]: IAK_XY_PLOT_TYPE,
  [MONITOR_BAR_CHART_TYPE]: IAK_BAR_CHART_TYPE,
  [MONITOR_KPI_TYPE]: IAK_KPI_TYPE,
  [MONITOR_STATUS_GRID_TYPE]: IAK_KPI_TYPE,
  [MONITOR_STATUS_TIMELINE_TYPE]: IAK_STATUS_TIMELINE_TYPE,
  [MONITOR_TABLE_TYPE]: IAK_TABLE_TYPE,
} as const;

export type WidgetMap = typeof widgetMap;

export type ReverseWidgetMap = {
  [K in keyof WidgetMap as WidgetMap[K]]: K;
};

export const isMappedToWidget = <WidgetType extends keyof ReverseWidgetMap>(
  widgetType: WidgetType,
  widget: ForeignWidgetInstance
): widget is ForeignWidgetInstance<WidgetType> => {
  return widgetMap[widget.type as keyof WidgetMap] === widgetType;
};

export type ForeignWidgetType = keyof typeof widgetMap;

export interface MonitorAnalysis {
  trends?: string[]; // We don't currently support trend lines but Monitor does
}

export interface MonitorMetric {
  type: string;
  label: string;
  assetId: string;
  propertyId: string;
  dataType: string;
  resolution?: string;
  analysis?: MonitorAnalysis;
}

export interface MonitorAnnotation {
  color: string;
  comparisonOperator: string;
  showValue: boolean;
  value: number;
}

export interface MonitorAnnotations {
  x?: MonitorAnnotation[];
  y?: MonitorAnnotation[];
}

export interface MonitorProperties {
  colorDataAcrossThresholds: boolean;
}

export interface ForeignWidgetInstance<
  WidgetType extends keyof ReverseWidgetMap = keyof ReverseWidgetMap
> {
  type: ReverseWidgetMap[WidgetType];
  title: string;
  x: number;
  y: number;
  height: number;
  width: number;
  properties?: MonitorProperties;
  metrics?: MonitorMetric[];
  annotations?: MonitorAnnotations;
  alarms?: string[]; // We don't currently support alarms but Monitor does
}

export interface ForeignDashboardDefinition {
  widgets?: ForeignWidgetInstance[];
}

export type AssetMap = Record<string, AssetPropertyQuery[]>;
