import React from 'react';
import { DialBase } from './dialBase';
import { DEFAULT_VIEWPORT, ECHARTS_GESTURE } from '../../common/constants';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import { useViewport } from '../../hooks/useViewport';
import type { Threshold, StyleSettingsMap, Viewport } from '@iot-app-kit/core';
import type { DialSettings } from './types';
import { DEFAULT_DIAL_SETTINGS } from './constants';
import type { ComponentQuery } from '../../common/chartTypes';
import { getTimeSeriesQueries } from '../../utils/queries';

export const Dial = ({
  query,
  viewport: passedInViewport,
  thresholds = [],
  styles,
  settings,
}: {
  query: ComponentQuery;
  viewport?: Viewport;
  thresholds?: Threshold[];
  styles?: StyleSettingsMap;
  settings?: DialSettings;
}) => {
  const { dataStreams } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: getTimeSeriesQueries([query]),
    // Currently set to only fetch raw data.
    // TODO: Support all resolutions and aggregation types
    settings: { fetchMostRecentBeforeEnd: true, resolution: '0' },
    styles,
  });
  const { viewport, lastUpdatedBy } = useViewport();
  const dialSettings: Required<DialSettings> = {
    ...DEFAULT_DIAL_SETTINGS,
    ...settings,
  };

  // if using echarts then echarts gesture overrides passed in viewport
  // else explicitly passed in viewport overrides viewport group
  const utilizedViewport =
    (lastUpdatedBy === ECHARTS_GESTURE
      ? viewport
      : passedInViewport || viewport) ?? DEFAULT_VIEWPORT;

  const {
    propertyPoint,
    alarmPoint,
    alarmThreshold,
    propertyThreshold,
    alarmStream,
    propertyStream,
  } = widgetPropertiesFromInputs({
    dataStreams,
    thresholds,
    viewport: utilizedViewport,
  });

  const name = propertyStream?.name || alarmStream?.name;
  const unit = propertyStream?.unit || alarmStream?.unit;
  const color =
    alarmThreshold?.color || propertyThreshold?.color || propertyStream?.color;

  return (
    <DialBase
      propertyPoint={propertyPoint}
      alarmPoint={alarmPoint}
      settings={dialSettings}
      name={name}
      unit={unit}
      color={color}
    />
  );
};
