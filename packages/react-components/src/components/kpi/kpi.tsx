/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import { CHART_ALARM_ERROR, DEFAULT_VIEWPORT } from '../../common/constants';
import type { AssistantProperty } from '../../common/assistantProps';
import { viewportEndDate, viewportStartDate } from '@iot-app-kit/core';
import { AssistantWrapperPanel } from '../assistant-panels/assistantWrapperPanel';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';
import type {
  StyleSettingsMap,
  Viewport,
  StyledThreshold,
} from '@iot-app-kit/core';
import type { KPISettings } from './types';
import { KpiBase } from './kpiBase';
import type { ComponentQuery } from '../../common/chartTypes';
import { getTimeSeriesQueries } from '../../utils/queries';
import { useSingleQueryAlarm } from '../../hooks/useSingleQueryAlarm';
import {
  convertToSupportedTimeRange,
  serializeTimeSeriesQuery,
} from '../../hooks/useAssistantContext/utils';
import { createNonNullableList } from '../../utils/createNonNullableList';

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
  query: ComponentQuery;
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
  const { viewport } = useViewport();
  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group

  const timeSeriesQueries = getTimeSeriesQueries([query]);

  const transformedAlarm = useSingleQueryAlarm({
    query,
    viewport: utilizedViewport,
  });

  const { dataStreams: timeSeriesDataStreams, thresholds: queryThresholds } =
    useTimeSeriesData({
      viewport: passedInViewport,
      queries: timeSeriesQueries,
      settings: {
        fetchMostRecentBeforeEnd: true,
      },
      styles,
    });

  const { setContextByComponent, transformTimeseriesDataToAssistantContext } =
    useAssistantContext();

  const allThresholds = useMemo(
    () => [
      ...queryThresholds,
      ...thresholds,
      ...createNonNullableList([transformedAlarm?.threshold]),
    ],
    [queryThresholds, thresholds, transformedAlarm]
  );

  const dataStreams = transformedAlarm?.datastream
    ? [transformedAlarm?.datastream]
    : timeSeriesDataStreams;

  const {
    propertyPoint,
    propertyThreshold,
    propertyStream,
    propertyResolution,
  } = widgetPropertiesFromInputs({
    dataStreams,
    thresholds: allThresholds,
    viewport: utilizedViewport,
  });

  const name = propertyStream?.name;
  const unit = propertyStream?.unit;
  const backgroundColor = settings?.color || settings?.backgroundColor;
  const isLoading = propertyStream?.isLoading || false;
  const error = transformedAlarm?.status?.isError
    ? CHART_ALARM_ERROR
    : propertyStream?.error;

  useEffect(() => {
    if (assistant) {
      if (transformedAlarm && transformedAlarm.alarmContent) {
        setContextByComponent(assistant.componentId, {
          timerange: convertToSupportedTimeRange(
            viewportStartDate(utilizedViewport),
            viewportEndDate(utilizedViewport)
          ),
          assetId: transformedAlarm.alarmContent.assetId,
          alarmName: transformedAlarm.alarmContent.alarmName,
        });
      } else if (timeSeriesQueries.length > 0) {
        setContextByComponent(
          assistant.componentId,
          transformTimeseriesDataToAssistantContext({
            start: viewportStartDate(utilizedViewport),
            end: viewportEndDate(utilizedViewport),
            queries: [serializeTimeSeriesQuery(timeSeriesQueries[0])],
          })
        );
      }
    }
  }, [utilizedViewport, query, assistant]);

  const component = (
    <KpiBase
      propertyPoint={propertyPoint}
      alarmContent={transformedAlarm?.alarmContent}
      alarmStatus={transformedAlarm?.status}
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
      assistant={assistant}
    />
  );

  if (assistant) {
    return (
      <AssistantWrapperPanel
        width='100%'
        height='100%'
        assistant={assistant}
        componentType='kpi'
      >
        {component}
      </AssistantWrapperPanel>
    );
  } else {
    return component;
  }
};
