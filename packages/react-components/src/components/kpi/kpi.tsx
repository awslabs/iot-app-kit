import React, { useEffect } from 'react';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import { DEFAULT_VIEWPORT } from '../../common/constants';
import type { AssistantProperty } from '../../common/assistantProps';
import {
  type StyleSettingsMap,
  type Viewport,
  type TimeSeriesDataQuery,
  type StyledThreshold,
  viewportEndDate,
  viewportStartDate,
} from '@iot-app-kit/core';
import type { KPISettings } from './types';
import { KpiBase } from './kpiBase';
import { ActionPanel } from '../assistant-action-panel/actionPanel';
import { useComponentId } from '../../hooks/useComponentId/useComponentId';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';

export const KPI = ({
  query,
  viewport: passedInViewport,
  thresholds = [],
  titleText,
  styles,
  settings,
  significantDigits,
  timeZone,
  assistant,
}: {
  query: TimeSeriesDataQuery;
  viewport?: Viewport;
  thresholds?: StyledThreshold[];
  titleText?: string;
  styles?: StyleSettingsMap;
  aggregationType?: string;
  settings?: Partial<KPISettings>;
  significantDigits?: number;
  timeZone?: string;
  assistant?: AssistantProperty;
}) => {
  const { dataStreams, thresholds: queryThresholds } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: [query],
    settings: {
      fetchMostRecentBeforeEnd: true,
    },
    styles,
  });
  const { viewport } = useViewport();
  const componentId = useComponentId();
  const { setContextByComponent, getSupportedTimeRange, getQueriesForContext } =
    useAssistantContext();

  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group

  const {
    propertyPoint,
    alarmPoint,
    propertyThreshold,
    alarmStream,
    propertyStream,
    propertyResolution,
  } = widgetPropertiesFromInputs({
    dataStreams,
    thresholds: [...queryThresholds, ...thresholds],
    viewport: utilizedViewport,
  });

  const name = propertyStream?.name || alarmStream?.name;
  const unit = propertyStream?.unit || alarmStream?.unit;
  const backgroundColor = settings?.color || settings?.backgroundColor;
  const isLoading =
    alarmStream?.isLoading || propertyStream?.isLoading || false;
  const error = alarmStream?.error || propertyStream?.error;

  useEffect(() => {
    const timerange = getSupportedTimeRange(
      viewportStartDate(utilizedViewport),
      viewportEndDate(utilizedViewport)
    );
    setContextByComponent(componentId, {
      timerange,
      queries: getQueriesForContext([query]),
    });
  }, [utilizedViewport, query]);

  const component = (
    <KpiBase
      propertyPoint={propertyPoint}
      alarmPoint={alarmPoint}
      settings={{ ...settings, backgroundColor }}
      propertyThreshold={propertyThreshold}
      aggregationType={dataStreams[0]?.aggregationType}
      resolution={propertyResolution}
      name={name}
      unit={unit}
      isLoading={isLoading}
      error={error?.msg}
      significantDigits={significantDigits}
      timeZone={timeZone}
      titleText={titleText}
    />
  );

  if (assistant) {
    return (
      <ActionPanel
        width='100%'
        height='100%'
        iconPosition='topRight'
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
