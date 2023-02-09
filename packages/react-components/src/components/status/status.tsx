import React from 'react';
import { StatusBase } from './statusBase';
import { TimeQuery, TimeSeriesData, TimeSeriesDataRequest, StyleSettingsMap, Viewport } from '@iot-app-kit/core';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import { Annotations } from '../../common/thresholdTypes';
import { StatusSettings } from './types';

export const Status = ({
  query,
  viewport,
  styles,
  annotations,
  settings,
}: {
  query: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
  viewport?: Viewport;
  annotations?: Annotations;
  styles?: StyleSettingsMap;
  settings?: StatusSettings;
}) => {
  const { dataStreams } = useTimeSeriesData({
    viewport,
    query,
    settings: { fetchMostRecentBeforeEnd: true },
    styles,
  });

  const { propertyPoint, alarmPoint, alarmThreshold, propertyThreshold, alarmStream, propertyStream } =
    widgetPropertiesFromInputs({ dataStreams, annotations, viewport });

  const name = alarmStream?.name || propertyStream?.name;
  const unit = alarmStream?.unit || (alarmStream == null && propertyStream?.unit);
  const color = alarmThreshold?.color || propertyThreshold?.color || settings?.color;

  return (
    <StatusBase
      propertyPoint={propertyPoint}
      alarmPoint={alarmPoint}
      settings={settings}
      name={name}
      unit={unit}
      color={color}
    />
  );
};
