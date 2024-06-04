export enum DashboardWidgetType {
  XYPlot = 'xy-plot',
  LineScatterChart = 'line-scatter-chart',
  LineChart = 'line-chart',
  ScatterChart = 'scatter-chart',
  BarChart = 'bar-chart',
  Kpi = 'kpi',
  Status = 'status',
  StatusTimeline = 'status-timeline',
  Table = 'table',
  Text = 'text',
}

export enum MonitorWidgetType {
  LineChart = 'sc-line-chart',
  ScatterChart = 'sc-scatter-chart',
  BarChart = 'sc-bar-chart',
  StatusTimeline = 'sc-status-timeline',
  Kpi = 'sc-kpi',
  StatusGrid = 'sc-status-grid',
  Table = 'sc-table',
}

export interface MonitorTrend {
  type: string;
  color: string;
}

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

export interface MonitorWidget {
  type: MonitorWidgetType;
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

export interface SiteWiseMonitorDashboardDefinition {
  widgets?: MonitorWidget[];
}

export interface ApplicationProperty {
  propertyId: string;
  aggregationType?: string;
  resolution?: string;
  refId?: string;
  color?: string;
}

interface ApplicationAsset {
  assetId: string;
  properties: ApplicationProperty[];
}

interface ApplicationQuery {
  properties: string[];
  assets: ApplicationAsset[];
}

interface ApplicationQueryConfig {
  source: string;
  query: ApplicationQuery;
}

export interface QueryConfig {
  queryConfig: ApplicationQueryConfig;
}

export type AssetMap = Record<string, ApplicationProperty[]>;
