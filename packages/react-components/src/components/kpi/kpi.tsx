import React from 'react';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import { DEFAULT_VIEWPORT } from '../../common/constants';
import type {
  StyleSettingsMap,
  Viewport,
  TimeSeriesDataQuery,
} from '@iot-app-kit/core';
import type { KPISettings } from './types';
import { UpdatedKpiBase } from './updatedKpiBase';
import { KpiBase } from './kpiBase';
import { StyledThreshold } from '../chart/types';

export const KPI = ({
  query,
  viewport: passedInViewport,
  thresholds = [],
  styles,
  settings,
  aggregationType,
  significantDigits,
}: {
  query: TimeSeriesDataQuery;
  viewport?: Viewport;
  thresholds?: StyledThreshold[];
  styles?: StyleSettingsMap;
  aggregationType?: string;
  settings?: Partial<KPISettings>;
  significantDigits?: number;
}) => {
  const { dataStreams, thresholds: queryThresholds } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: [query],
    settings: {
      fetchMostRecentBeforeEnd: true,
      fetchMostRecentBeforeStart: true,
    },
    styles,
  });
  const { viewport } = useViewport();

  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group

  const {
    propertyPoint,
    alarmPoint,
    alarmThreshold,
    propertyThreshold,
    alarmStream,
    propertyStream,
    propertyResolution,
  } = widgetPropertiesFromInputs({
    dataStreams,
    thresholds: [...queryThresholds, ...thresholds],
    viewport: utilizedViewport,
  });

  const name = propertyStream?.name || alarmStream?.name;
  const unit = propertyStream?.unit || alarmStream?.unit;
  const color =
    alarmThreshold?.color ||
    propertyThreshold?.color ||
    settings?.color ||
    settings?.backgroundColor;
  const isLoading =
    alarmStream?.isLoading || propertyStream?.isLoading || false;
  const error = alarmStream?.error || propertyStream?.error;

  const hasNewKPI = !!localStorage?.getItem('USE_UPDATED_KPI');

  if (hasNewKPI)
    return (
      <UpdatedKpiBase
        propertyPoint={propertyPoint}
        alarmPoint={alarmPoint}
        settings={{ ...settings, backgroundColor: color }}
        aggregationType={dataStreams[0]?.aggregationType}
        resolution={propertyResolution}
        name={name}
        unit={unit}
        isLoading={isLoading}
        error={error?.msg}
        significantDigits={significantDigits}
      />
    );

  return (
    <KpiBase
      propertyPoint={propertyPoint}
      alarmPoint={alarmPoint}
      settings={settings}
      aggregationType={aggregationType}
      resolution={propertyResolution}
      name={name}
      unit={unit}
      color={color}
      isLoading={isLoading}
      error={error?.msg}
      significantDigits={significantDigits}
    />
  );
};
