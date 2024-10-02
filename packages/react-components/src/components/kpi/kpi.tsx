/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from 'react';
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
import { getAlarmQueries, getTimeSeriesQueries } from '../../utils/queries';
import { convertAlarmQueryToAlarmRequest } from '../../queries/utils/convertAlarmQueryToAlarmRequest';
import { useAlarms } from '../../hooks/useAlarms';
import { buildTransformAlarmForSingleQueryWidgets } from '../../utils/buildTransformAlarmForSingleQueryWidgets';
import {
  convertToSupportedTimeRange,
  serializeTimeSeriesQuery,
} from '../../hooks/useAssistantContext/utils';

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

  const alarmQueries = getAlarmQueries([query]);
  const timeSeriesQueries = getTimeSeriesQueries([query]);

  const mapAlarmQueriesToRequests = alarmQueries.flatMap((query) =>
    convertAlarmQueryToAlarmRequest(query)
  );

  const inputPropertyTimeSeriesDataSettings =
    alarmQueries.at(0)?.query.requestSettings;

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
      ...inputPropertyTimeSeriesDataSettings,
    }),
  })
    .filter((alarm) => !!alarm)
    .at(0);

  const { dataStreams, thresholds: queryThresholds } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: transformedAlarm
      ? transformedAlarm.timeSeriesDataQueries
      : timeSeriesQueries,
    settings: {
      fetchMostRecentBeforeEnd: true,
    },
    styles,
  });
  const { setContextByComponent, transformTimeseriesDataToAssistantContext } =
    useAssistantContext();

  const allThresholds = useMemo(() => {
    const allThresholds = [...queryThresholds, ...thresholds];
    transformedAlarm?.threshold &&
      allThresholds.push(transformedAlarm?.threshold);
    return allThresholds;
  }, [
    JSON.stringify(queryThresholds),
    JSON.stringify(thresholds),
    JSON.stringify(transformedAlarm?.threshold),
  ]);

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
  const isLoading =
    propertyStream?.isLoading || transformedAlarm?.status.isLoading || false;
  const error = transformedAlarm?.status.isError
    ? CHART_ALARM_ERROR
    : propertyStream?.error;

  useEffect(() => {
    if (assistant) {
      if (transformedAlarm) {
        setContextByComponent(assistant.componentId, {
          timerange: convertToSupportedTimeRange(
            viewportStartDate(utilizedViewport),
            viewportEndDate(utilizedViewport)
          ),
          assetId: transformedAlarm.assetId,
          alarmName: transformedAlarm.alarmName,
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
      alarmContent={transformedAlarm}
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
