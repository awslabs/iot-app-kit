// eslint-disable-next-line import/default
import React from 'react';

import { GaugeBase } from './gaugeBase';
import { GaugeProps } from './types';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import { DEFAULT_VIEWPORT, ECHARTS_GESTURE } from '../../common/constants';
import { DataStream } from '@iot-app-kit/core';

export const Gauge = ({
  query,
  viewport: passedInViewport,
  thresholds = [],
  styles,
  settings,
  significantDigits,
  theme,
}: GaugeProps) => {
  const { dataStreams } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: [query],
    settings: { fetchMostRecentBeforeEnd: true },
    styles,
  });
  const { viewport, lastUpdatedBy } = useViewport();

  const utilizedViewport =
    (lastUpdatedBy === ECHARTS_GESTURE
      ? viewport
      : passedInViewport || viewport) ?? DEFAULT_VIEWPORT;

  const { propertyPoint, alarmStream, propertyStream } =
    widgetPropertiesFromInputs({
      dataStreams,
      thresholds,
      viewport: utilizedViewport,
    });

  const streamToUse = [propertyStream, alarmStream].find(Boolean) as DataStream;
  const name = streamToUse?.name;
  const unit = streamToUse?.unit;
  const isLoading = streamToUse?.isLoading || false;
  const error = streamToUse?.error;

  return (
    <GaugeBase
      propertyPoint={propertyPoint}
      name={name}
      unit={unit}
      isLoading={isLoading}
      error={error?.msg}
      settings={settings}
      thresholds={thresholds}
      significantDigits={significantDigits}
      theme={theme}
    />
  );
};
