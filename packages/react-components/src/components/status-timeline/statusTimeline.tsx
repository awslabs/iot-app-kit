/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import { StyleSettingsMap, Threshold, Viewport } from '@iot-app-kit/core';
import {
  StatusTimeline as StatusTimelineBaseWrongType,
  LineChart,
} from '@iot-app-kit/charts';
import type {
  DataStream as DataStreamViz,
  Annotations,
} from '@iot-app-kit/charts-core';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import {
  DEFAULT_LEGEND,
  DEFAULT_VIEWPORT,
  ECHARTS_GESTURE,
} from '../../common/constants';
import type { ComponentQuery } from '../../common/chartTypes';
import { useAlarms } from '../../hooks/useAlarms';
import { getAlarmQueries, getTimeSeriesQueries } from '../../utils/queries';
import { convertAlarmQueryToAlarmRequest } from '../../queries/utils/convertAlarmQueryToAlarmRequest';
import {
  ALARM_STATE_THRESHOLDS,
  transformAlarmStateToDataStream,
} from './alarmTransforms';

// TODO: Remove this type assertion - iot-app-kit/charts has the wrong type for StatusTimeline
const StatusTimelineBase: typeof LineChart =
  StatusTimelineBaseWrongType as unknown as typeof LineChart;

type StatusTimelineAxisSettings = { showX?: boolean };

export const StatusTimeline = ({
  queries,
  thresholds = [],
  viewport: passedInViewport,
  aggregationType,
  styles,
  ...rest
}: {
  queries: ComponentQuery[];
  axis?: StatusTimelineAxisSettings;
  thresholds?: Threshold[];
  viewport?: Viewport;
  styles?: StyleSettingsMap;
  aggregationType?: string;
  gestures?: boolean;
  significantDigits?: number;
}) => {
  const { viewport, setViewport, group, lastUpdatedBy } = useViewport();
  // if using echarts then echarts gesture overrides passed in viewport
  // else explicitly passed in viewport overrides viewport group
  const utilizedViewport =
    (lastUpdatedBy === ECHARTS_GESTURE
      ? viewport
      : passedInViewport || viewport) ?? DEFAULT_VIEWPORT;

  const alarmQueries = getAlarmQueries(queries);
  const timeSeriesQueries = getTimeSeriesQueries(queries);

  const alarmStateDataStreams = useAlarms({
    iotSiteWiseClient: alarmQueries.at(0)?.iotSiteWiseClient,
    iotEventsClient: alarmQueries.at(0)?.iotEventsClient,
    requests: alarmQueries.flatMap((query) =>
      convertAlarmQueryToAlarmRequest(query)
    ),
    viewport: utilizedViewport,
    settings: {
      fetchThresholds: true,
      refreshRate: alarmQueries.at(0)?.query.requestSettings?.refreshRate,
    },
    transform: transformAlarmStateToDataStream,
  });

  const { dataStreams, thresholds: queryThresholds } = useTimeSeriesData({
    viewport: passedInViewport,
    queries: timeSeriesQueries,
    settings: {
      fetchFromStartToEnd: true,
      fetchMostRecentBeforeStart: true,
      resolution: '0',
    },
    styles,
  });

  const allThresholds = useMemo(() => {
    const all = [...queryThresholds, ...thresholds];
    if (alarmStateDataStreams.length > 0) all.push(...ALARM_STATE_THRESHOLDS);
    return all;
  }, [
    JSON.stringify(queryThresholds),
    JSON.stringify(thresholds),
    alarmStateDataStreams.length,
  ]);

  return (
    <StatusTimelineBase
      aggregationType={aggregationType}
      widgetId=''
      dataStreams={
        [...dataStreams, ...alarmStateDataStreams] as DataStreamViz[]
      }
      viewport={{ ...utilizedViewport, group, lastUpdatedBy }}
      annotations={{ y: allThresholds } as Annotations}
      setViewport={setViewport}
      legend={DEFAULT_LEGEND}
      {...rest}
    />
  );
};
