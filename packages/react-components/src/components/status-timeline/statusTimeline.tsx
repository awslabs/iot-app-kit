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
import { AssistantProperty } from '../../common/assistantProps';
import {
  DEFAULT_LEGEND,
  DEFAULT_VIEWPORT,
  ECHARTS_GESTURE,
} from '../../common/constants';
import { Title } from '../../common/title';
import type { ComponentQuery } from '../../common/chartTypes';
import { useAlarms } from '../../hooks/useAlarms';
import { getAlarmQueries, getTimeSeriesQueries } from '../../utils/queries';
import { transformAlarmsToThreshold } from '../../utils/transformAlarmsToThreshold';
import { convertAlarmQueryToAlarmRequest } from '../../queries/utils/convertAlarmQueryToAlarmRequest';

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
  assistant?: AssistantProperty;
  titleText?: string;
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

  const transformedAlarms = useAlarms({
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
    transform: transformAlarmsToThreshold,
  });
  const filteredAlarms = transformedAlarms.filter((alarm) => !!alarm);

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

  const allThresholds = useMemo(
    () => [...queryThresholds, ...thresholds, ...filteredAlarms],
    [
      JSON.stringify(queryThresholds),
      JSON.stringify(thresholds),
      JSON.stringify(filteredAlarms),
    ]
  );

  return (
    <div style={{ height: 'inherit' }}>
      <Title text={rest.titleText} />
      <StatusTimelineBase
        aggregationType={aggregationType}
        widgetId=''
        dataStreams={dataStreams as DataStreamViz[]}
        viewport={{ ...utilizedViewport, group, lastUpdatedBy }}
        annotations={{ y: allThresholds } as Annotations}
        setViewport={setViewport}
        legend={DEFAULT_LEGEND}
        {...rest}
      />
    </div>
  );
};
