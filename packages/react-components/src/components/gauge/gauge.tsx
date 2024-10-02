/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from 'react';
import { AssistantWrapperPanel } from '../assistant-panels/assistantWrapperPanel';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import {
  CHART_ALARM_ERROR,
  DEFAULT_VIEWPORT,
  ECHARTS_GESTURE,
} from '../../common/constants';
import {
  DataStream,
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
import { getAlarmQueries, getTimeSeriesQueries } from '../../utils/queries';
import { convertAlarmQueryToAlarmRequest } from '../../queries/utils/convertAlarmQueryToAlarmRequest';
import { useAlarms } from '../../hooks/useAlarms';
import { buildTransformAlarmForSingleQueryWidgets } from '../../utils/buildTransformAlarmForSingleQueryWidgets';

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
  const alarmQueries = getAlarmQueries([query]);
  const timeSeriesQueries = getTimeSeriesQueries([query]);
  const { viewport, lastUpdatedBy } = useViewport();
  const { setContextByComponent, transformTimeseriesDataToAssistantContext } =
    useAssistantContext();

  const utilizedViewport =
    (lastUpdatedBy === ECHARTS_GESTURE
      ? viewport
      : passedInViewport || viewport) ?? DEFAULT_VIEWPORT;

  const mapAlarmQueriesToRequests = alarmQueries.flatMap((query) =>
    convertAlarmQueryToAlarmRequest(query)
  );

  const transformedAlarm = useAlarms({
    iotSiteWiseClient: alarmQueries.at(0)?.iotSiteWiseClient,
    iotEventsClient: alarmQueries.at(0)?.iotEventsClient,
    requests: mapAlarmQueriesToRequests,
    viewport: utilizedViewport,
    settings: {
      fetchThresholds: true,
      fetchOnlyLatest: true,
      refreshRate: alarmQueries.at(0)?.query.requestSettings?.refreshRate,
    },
    transform: buildTransformAlarmForSingleQueryWidgets({
      iotSiteWiseClient: alarmQueries.at(0)?.iotSiteWiseClient,
      iotEventsClient: alarmQueries.at(0)?.iotEventsClient,
    }),
  })
    .filter((alarm) => !!alarm)
    .at(0);

  const { dataStreams } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: transformedAlarm
      ? transformedAlarm.timeSeriesDataQueries
      : timeSeriesQueries,
    settings: { fetchMostRecentBeforeEnd: true },
    styles,
  });

  const { propertyPoint, alarmStream, propertyStream } =
    widgetPropertiesFromInputs({
      dataStreams,
      thresholds,
      viewport: utilizedViewport,
    });

  const streamToUse = [propertyStream, alarmStream].find(Boolean) as DataStream;
  const name = streamToUse?.name;
  const unit = streamToUse?.unit;
  const isLoading =
    streamToUse?.isLoading || transformedAlarm?.status.isLoading || false;
  const error = transformedAlarm?.status.isError
    ? CHART_ALARM_ERROR
    : streamToUse?.error;

  const refId = dataStreams[0]?.refId;
  const color =
    styles && refId ? styles[refId]?.color : DEFAULT_GAUGE_PROGRESS_COLOR;

  useEffect(() => {
    if (assistant) {
      setContextByComponent(
        assistant.componentId,
        transformTimeseriesDataToAssistantContext({
          start: viewportStartDate(utilizedViewport),
          end: viewportEndDate(utilizedViewport),
          queries: timeSeriesQueries,
        })
      );
    }
  }, [utilizedViewport, query, assistant]);

  const allThresholds = useMemo(() => {
    return transformedAlarm?.threshold
      ? [...thresholds, transformedAlarm?.threshold]
      : thresholds;
  }, [JSON.stringify(thresholds), JSON.stringify(transformedAlarm?.threshold)]);

  const component = (
    <GaugeBase
      alarmContent={transformedAlarm}
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
