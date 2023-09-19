import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { LineScatterChartWidget, QueryWidget } from '../types';

export const WidgetDefaultAggregation: Record<string, AggregateType | undefined> = {
  'bar-chart': AggregateType.AVERAGE,
  'line-chart': AggregateType.AVERAGE,
  'line-scatter-chart': AggregateType.AVERAGE,
  'scatter-chart': AggregateType.AVERAGE,
  'status-timeline': undefined,
  kpi: undefined,
  status: undefined,
  table: undefined,
};

export const WidgetDefaultResolution: Record<string, string | undefined> = {
  'bar-chart': '1m',
  'line-chart': '1m',
  'line-scatter-chart': '1m',
  'scatter-chart': '1m',
  'status-timeline': '0',
  kpi: '0',
  status: '0',
  table: '0',
};

export const getCurrentAggregationResolution = (widget: QueryWidget | LineScatterChartWidget) => {
  if ('aggregationType' in widget.properties && 'resolution' in widget.properties) {
    return {
      aggregation: widget.properties.aggregationType,
      resolution: widget.properties.resolution,
    };
  }

  const widgetType = widget.type;
  const firstAssetProperty = widget.properties.queryConfig.query?.assets[0].properties[0];
  const currentAggregation = firstAssetProperty?.aggregationType ?? WidgetDefaultAggregation[widgetType];
  const currentResolution = firstAssetProperty?.resolution ?? WidgetDefaultResolution[widgetType];

  return {
    aggregation: currentAggregation,
    resolution: currentResolution,
  };
};

export const getAggregation = (widget: QueryWidget | LineScatterChartWidget) => {
  if ('aggregationType' in widget.properties && 'resolution' in widget.properties) {
    return widget.properties.aggregationType;
  }

  const firstAssetProperty = widget.properties.queryConfig.query?.assets[0].properties[0];
  return firstAssetProperty?.aggregationType;
};
