import React from 'react';
import { KpiBase } from './kpiBase';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import type { Annotations, StyleSettingsMap, Viewport, TimeSeriesDataQuery } from '@iot-app-kit/core';
import type { KPISettings } from './types';
import { DEFAULT_KPI_SETTINGS } from './constants';

export const Kpi = ({
  query,
  viewport: passedInViewport,
  annotations,
  styles,
  settings,
}: {
  query: TimeSeriesDataQuery;
  viewport?: Viewport;
  annotations?: Annotations;
  styles?: StyleSettingsMap;
  settings?: KPISettings;
}) => {
  const { dataStreams } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: [query],
    settings: { fetchMostRecentBeforeEnd: true },
    styles,
  });
  const { viewport } = useViewport();
  const kpiSettings = {
    DEFAULT_KPI_SETTINGS,
    ...settings,
  };

  const utilizedViewport = passedInViewport || viewport || { duration: '10m' }; // explicitly passed in viewport overrides viewport group

  const { propertyPoint, alarmPoint, alarmThreshold, propertyThreshold, alarmStream, propertyStream } =
    widgetPropertiesFromInputs({ dataStreams, annotations, viewport: utilizedViewport });

  const name = propertyStream?.name || alarmStream?.name;
  const unit = propertyStream?.unit || alarmStream?.unit;
  const color = alarmThreshold?.color || propertyThreshold?.color || settings?.color;

  return (
    <KpiBase
      propertyPoint={propertyPoint}
      alarmPoint={alarmPoint}
      settings={kpiSettings}
      name={name}
      unit={unit}
      color={color}
    />
  );
};
