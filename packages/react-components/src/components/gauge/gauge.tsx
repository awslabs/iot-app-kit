// eslint-disable-next-line import/default
import React from 'react';
import { ActionPanel, getActionPanelProps } from '../assistant-action-panel/actionPanel';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import { DEFAULT_VIEWPORT, ECHARTS_GESTURE } from '../../common/constants';
import { DataStream } from '@iot-app-kit/core';
import { GaugeBase } from './gaugeBase';
import type { GaugeProps } from './types';
import {
  DEFAULT_GAUGE_PROGRESS_COLOR,
  DEFAULT_GAUGE_STYLES,
} from './constants';

export const Gauge = ({
  size,
  query,
  viewport: passedInViewport,
  thresholds = [],
  styles,
  settings,
  significantDigits,
  theme,
  assistant,
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

  const refId = dataStreams[0]?.refId;
  const color =
    styles && refId ? styles[refId]?.color : DEFAULT_GAUGE_PROGRESS_COLOR;

  const component = (
    <GaugeBase
      size={size}
      propertyPoint={propertyPoint}
      name={name}
      unit={unit}
      isLoading={isLoading}
      error={error?.msg}
      settings={{ ...DEFAULT_GAUGE_STYLES, ...settings, color }}
      thresholds={thresholds}
      significantDigits={significantDigits}
      theme={theme}
    />
  );

  if (assistant) {
    return (
      <ActionPanel 
        {...getActionPanelProps({
          width: 'min-content',
          height: 'min-content'
        }, assistant)}
      >
        {component}
      </ActionPanel>
    );
  } else {
    return component;
  }
};
