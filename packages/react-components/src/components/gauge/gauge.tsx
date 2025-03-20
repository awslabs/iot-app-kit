/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react';
import { AssistantWrapperPanel } from '../assistant-panels/assistantWrapperPanel';
import {
  DEFAULT_VIEWPORT,
  getTimeSeriesQueries,
  useSingleQueryAlarm,
  useTimeSeriesData,
  useViewport,
} from '@iot-app-kit/component-core';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import { CHART_ALARM_ERROR, ECHARTS_GESTURE } from '../../common/constants';
import {
  type DataStream,
  viewportEndDate,
  viewportStartDate,
} from '@iot-app-kit/core';
import { GaugeBase } from './gaugeBase';
import type { GaugeProps } from './types';
import {
  DEFAULT_GAUGE_PROGRESS_COLOR,
  DEFAULT_GAUGE_STYLES,
} from './constants';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';
import {
  convertToSupportedTimeRange,
  serializeTimeSeriesQuery,
} from '../../hooks/useAssistantContext/utils';

export const Gauge = ({
  size,
  query,
  viewport: passedInViewport,
  thresholds = [],
  titleText,
  styles,
  settings,
  significantDigits,
  theme,
  assistant,
}: GaugeProps) => {
  const timeSeriesQueries = getTimeSeriesQueries([query]);
  const { viewport, lastUpdatedBy } = useViewport();
  const { setContextByComponent, transformTimeseriesDataToAssistantContext } =
    useAssistantContext();

  const utilizedViewport =
    (lastUpdatedBy === ECHARTS_GESTURE
      ? viewport
      : passedInViewport || viewport) ?? DEFAULT_VIEWPORT;

  const transformedAlarm = useSingleQueryAlarm({
    query,
    viewport: utilizedViewport,
  });

  const { dataStreams: timeSeriesDataStreams } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: timeSeriesQueries,
    settings: { fetchMostRecentBeforeEnd: true },
    styles,
  });

  const dataStreams = transformedAlarm?.datastream
    ? [transformedAlarm?.datastream]
    : timeSeriesDataStreams;

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
  const error = transformedAlarm?.status?.isError
    ? CHART_ALARM_ERROR
    : streamToUse?.error;

  const refId = dataStreams[0]?.refId;
  const color =
    styles && refId ? styles[refId]?.color : DEFAULT_GAUGE_PROGRESS_COLOR;

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

  const allThresholds = useMemo(() => {
    return transformedAlarm?.threshold
      ? [...thresholds, transformedAlarm?.threshold]
      : thresholds;
  }, [JSON.stringify(thresholds), JSON.stringify(transformedAlarm?.threshold)]);

  const component = (
    <GaugeBase
      alarmContent={transformedAlarm?.alarmContent}
      alarmStatus={transformedAlarm?.status}
      size={size}
      propertyPoint={propertyPoint}
      name={name}
      unit={unit}
      titleText={titleText}
      isLoading={isLoading}
      error={error?.msg}
      settings={{ ...DEFAULT_GAUGE_STYLES, ...settings, color }}
      thresholds={allThresholds}
      significantDigits={significantDigits}
      theme={theme}
      assistant={assistant}
    />
  );

  if (assistant) {
    return (
      <AssistantWrapperPanel
        width='min-content'
        height='min-content'
        assistant={assistant}
        componentType='gauge'
      >
        {component}
      </AssistantWrapperPanel>
    );
  } else {
    return component;
  }
};
