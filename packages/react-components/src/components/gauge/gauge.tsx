import React, { useEffect } from 'react';
import { ActionPanel } from '../assistant-action-panel/actionPanel';
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
import { useComponentId } from '../../hooks/useComponentId/useComponentId';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';

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
  const componentId = useComponentId();
  const { dataStreams } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: [query],
    settings: { fetchMostRecentBeforeEnd: true },
    styles,
  });
  const { viewport, lastUpdatedBy } = useViewport();
  const { setContextByComponent } = useAssistantContext();

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

  useEffect(() => {
    setContextByComponent(componentId, {
      timerange: utilizedViewport,
      queries: [query.toQueryString()],
    });
  }, [utilizedViewport, query]);

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
        width='min-content'
        height='min-content'
        componentId={componentId}
        assistant={assistant}
      >
        {component}
      </ActionPanel>
    );
  } else {
    return component;
  }
};
