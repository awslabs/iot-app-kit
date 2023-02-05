import React from 'react';
import { KpiBase } from './kpiBase';
import { TimeQuery, TimeSeriesData, TimeSeriesDataRequest, StyleSettingsMap, Viewport } from '@iot-app-kit/core';
import { useTimeSeriesDataFromViewport } from '../hooks/useTimeSeriesDataFromViewport/useTimeSeriesDataFromViewport';
import { widgetPropertiesFromInputs } from '../common/widgetPropertiesFromInputs';
import { Annotations } from '../common/thresholdTypes';
import { KPISettings } from './types';

export const Kpi = ({
  query,
  viewport,
  color,
  styles,
  settings,
}: {
  query: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
  viewport: Viewport;
  annotations?: Annotations;
  color?: string;
  styles?: StyleSettingsMap;
  settings?: KPISettings;
}) => {
  const { dataStreams } = useTimeSeriesDataFromViewport({
    viewport,
    query,
    settings: { fetchMostRecentBeforeEnd: true },
    styles,
  });

  return <KpiBase settings={settings} {...widgetPropertiesFromInputs({ dataStreams, color })} />;
};
