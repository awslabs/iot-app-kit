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

export const Status = ({
  query,
  viewport: passedInViewport,
  styles,
  thresholds = [],
  settings,
}: {
  query: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
  viewport?: Viewport;
  thresholds?: Threshold[];
  styles?: StyleSettingsMap;
  settings?: Partial<StatusSettings>;
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

  const { propertyPoint, alarmPoint, alarmThreshold, propertyThreshold, alarmStream, propertyStream } =
    widgetPropertiesFromInputs({
      dataStreams,
      thresholds: [...queryThresholds, ...thresholds],
      viewport: utilizedViewport,
    });

  const name = alarmStream?.name || propertyStream?.name;
  const unit = alarmStream?.unit || (alarmStream == null && propertyStream?.unit) || undefined;
  const color = alarmThreshold?.color || propertyThreshold?.color || settings?.color;
  const isLoading = alarmStream?.isLoading || propertyStream?.isLoading || false;
  const error = alarmStream?.error || propertyStream?.error;

  return (
    <StatusBase
      propertyPoint={propertyPoint}
      alarmPoint={alarmPoint}
      settings={settings}
      name={name}
      unit={unit}
      color={color}
      isLoading={isLoading}
      error={error?.msg}
    />
  );
};
