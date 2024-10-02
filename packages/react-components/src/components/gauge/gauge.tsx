/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';

import { GaugeBase } from './gaugeBase';
import { GaugeProps } from './types';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { widgetPropertiesFromInputs } from '../../common/widgetPropertiesFromInputs';
import {
  CHART_ALARM_ERROR,
  DEFAULT_VIEWPORT,
  ECHARTS_GESTURE,
} from '../../common/constants';
import { DataStream } from '@iot-app-kit/core';
import {
  DEFAULT_GAUGE_PROGRESS_COLOR,
  DEFAULT_GAUGE_STYLES,
} from './constants';
import { getAlarmQueries, getTimeSeriesQueries } from '../../utils/queries';
import { convertAlarmQueryToAlarmRequest } from '../../queries/utils/convertAlarmQueryToAlarmRequest';
import { useAlarms } from '../../hooks/useAlarms';
import { buildTransformAlarmForSingleQueryWidgets } from '../../utils/buildTransformAlarmForSingleQueryWidgets';

export const Gauge = ({
  size,
  query,
  viewport: passedInViewport,
  thresholds = [],
  styles,
  settings,
  significantDigits,
  theme,
}: GaugeProps) => {
  const { viewport, lastUpdatedBy } = useViewport();
  const utilizedViewport =
    (lastUpdatedBy === ECHARTS_GESTURE
      ? viewport
      : passedInViewport || viewport) ?? DEFAULT_VIEWPORT;

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
  const isLoading = streamToUse?.isLoading || false;
  const error = transformedAlarm?.status.isError
    ? CHART_ALARM_ERROR
    : streamToUse?.error;

  const refId = dataStreams[0]?.refId;
  const color =
    styles && refId ? styles[refId]?.color : DEFAULT_GAUGE_PROGRESS_COLOR;

  const allThresholds = useMemo(() => {
    return transformedAlarm?.threshold
      ? [...thresholds, transformedAlarm?.threshold]
      : thresholds;
  }, [JSON.stringify(thresholds), JSON.stringify(transformedAlarm?.threshold)]);

  return (
    <GaugeBase
      alarmState={transformedAlarm?.state}
      alarmStatus={transformedAlarm?.status}
      size={size}
      propertyPoint={propertyPoint}
      name={name}
      unit={unit}
      isLoading={isLoading}
      error={error?.msg}
      settings={{ ...DEFAULT_GAUGE_STYLES, ...settings, color }}
      thresholds={allThresholds}
      significantDigits={significantDigits}
      theme={theme}
    />
  );
};
