import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { AssetQuery } from '@iot-app-kit/source-iotsitewise/dist/es/time-series-data/types';
import { SiteWiseQueryConfig } from '../types';

export const WidgetDefaultAggregation: Record<string, AggregateType | undefined> = {
  'bar-chart': AggregateType.AVERAGE,
  'line-chart': AggregateType.AVERAGE,
  'scatter-chart': AggregateType.AVERAGE,
  'status-timeline': undefined,
  kpi: undefined,
  status: undefined,
  table: undefined,
};

export const WidgetDefaultResolution: Record<string, string | undefined> = {
  'bar-chart': '1m',
  'line-chart': '1m',
  'scatter-chart': '1m',
  'status-timeline': '0',
  kpi: '0',
  status: '0',
  table: '0',
};

export const getCurrentAggregationResolution = (assets: AssetQuery[], widgetType: string) => {
  const currentAggregation = assets[0]?.properties[0]?.aggregationType || WidgetDefaultAggregation[widgetType];
  const currentResolution = assets[0]?.properties[0]?.resolution || WidgetDefaultResolution[widgetType];

  return {
    aggregation: currentAggregation,
    resolution: currentResolution,
  };
};

export const getAggregation = (queryConfig: SiteWiseQueryConfig) => {
  return queryConfig.query?.assets[0]?.properties[0].aggregationType;
};
