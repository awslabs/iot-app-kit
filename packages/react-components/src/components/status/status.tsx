import React from 'react';
import { StatusBase } from './statusBase';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import { useViewport } from '../../hooks/useViewport';
import type {
  Threshold,
  TimeQuery,
  TimeSeriesData,
  TimeSeriesDataRequest,
  StyleSettingsMap,
  Viewport,
} from '@iot-app-kit/core';
import type { StatusSettings } from './types';
import { DEFAULT_VIEWPORT } from '../../common/constants';
import { UpdatedKpiBase } from '../kpi/updatedKpiBase';

export const Status = ({
  query,
  viewport: passedInViewport,
  styles,
  thresholds = [],
  aggregationType,
  settings,
  significantDigits,
}: {
  query: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
  viewport?: Viewport;
  aggregationType?: string;
  thresholds?: Threshold[];
  styles?: StyleSettingsMap;
  settings?: Partial<StatusSettings>;
  significantDigits?: number;
}) => {
  const { dataStreams, thresholds: queryThresholds } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: [query],
    // Currently set to only fetch raw data.
    // TODO: Support all resolutions and aggregation types
    settings: { fetchMostRecentBeforeEnd: true, resolution: '0' },
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

  const name = alarmStream?.name || propertyStream?.name;
  const unit =
    alarmStream?.unit ||
    (alarmStream == null && propertyStream?.unit) ||
    undefined;
  const color =
    alarmThreshold?.color || propertyThreshold?.color || settings?.color;
  const isLoading =
    alarmStream?.isLoading || propertyStream?.isLoading || false;
  const error = alarmStream?.error || propertyStream?.error;

  const hasNewKPI = !!localStorage?.getItem('USE_UPDATED_KPI');

  if (hasNewKPI)
    return (
      <UpdatedKpiBase
        aggregationType={aggregationType}
        propertyPoint={propertyPoint}
        resolution={propertyResolution}
        alarmPoint={alarmPoint}
        settings={settings}
        name={name}
        unit={unit}
        color={color}
        isLoading={isLoading}
        error={error?.msg}
        significantDigits={significantDigits}
      />
    );

  return (
    <StatusBase
      aggregationType={aggregationType}
      propertyPoint={propertyPoint}
      resolution={propertyResolution}
      alarmPoint={alarmPoint}
      settings={settings}
      name={name}
      unit={unit}
      color={color}
      isLoading={isLoading}
      error={error?.msg}
      significantDigits={significantDigits}
    />
  );
};
