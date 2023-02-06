import React from 'react';
import { StatusBase } from './statusBase';
import { TimeQuery, TimeSeriesData, TimeSeriesDataRequest, StyleSettingsMap, Viewport } from '@iot-app-kit/core';
import { useTimeSeriesDataFromViewport } from '../hooks/useTimeSeriesDataFromViewport/useTimeSeriesDataFromViewport';
import { widgetPropertiesFromInputs } from '../common/widgetPropertiesFromInputs';
import { Annotations } from '../common/thresholdTypes';
import { StatusSettings } from './types';

export const Status = ({
  query,
  viewport,
  styles,
  settings,
}: {
  query: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
  viewport: Viewport;
  annotations?: Annotations;
  styles?: StyleSettingsMap;
  settings?: StatusSettings;
}) => {
  const { dataStreams } = useTimeSeriesDataFromViewport({
    viewport,
    query,
    settings: { fetchMostRecentBeforeEnd: true },
    styles,
  });

  return <StatusBase settings={settings} {...widgetPropertiesFromInputs({ dataStreams, color: 'black' })} />;
};
