/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import {
  StyleSettingsMap,
  Threshold,
  Viewport,
  ThresholdSettings,
} from '@iot-app-kit/core';
import { BarChart as BarChartBase } from '@iot-app-kit/charts';
import type {
  DataStream as DataStreamViz,
  YAnnotation,
} from '@iot-app-kit/charts-core';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import {
  DEFAULT_LEGEND,
  DEFAULT_VIEWPORT,
  ECHARTS_GESTURE,
} from '../../common/constants';
import { getAlarmQueries, getTimeSeriesQueries } from '../../utils/queries';
import {
  AxisSettings,
  ChartSize,
  ComponentQuery,
} from '../../common/chartTypes';
import { useAlarms } from '../../hooks/useAlarms';
import { convertAlarmQueryToAlarmRequest } from '../../queries/utils/convertAlarmQueryToAlarmRequest';
import { transformAlarmsToThreshold } from '../../utils/transformAlarmsToThreshold';

const HOUR_IN_MS = 1000 * 60 * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;
const FIFTEEN_MIN_IN_MS = 15 * 60 * 1000;
export interface BarChartProps {
  queries: ComponentQuery[];
  thresholdSettings?: ThresholdSettings;
  chartSize?: ChartSize;
  axis?: AxisSettings;
  yMin?: number;
  yMax?: number;
  thresholds?: Threshold[];
  viewport?: Viewport;
  styles?: StyleSettingsMap;
  aggregationType?: string;
  gestures?: boolean;
  significantDigits?: number;
}

export const BarChart = (props: BarChartProps) => {
  const {
    queries,
    thresholds = [],
    yMin,
    yMax,
    axis,
    viewport: passedInViewport,
    thresholdSettings,
    aggregationType,
    styles,
    ...rest
  } = props;

  const { viewport, setViewport, group, lastUpdatedBy } = useViewport();

  // if using echarts then echarts gesture overrides passed in viewport
  // else explicitly passed in viewport overrides viewport group
  const utilizedViewport =
    (lastUpdatedBy === ECHARTS_GESTURE
      ? viewport
      : passedInViewport || viewport) ?? DEFAULT_VIEWPORT;

  const alarmQueries = getAlarmQueries(queries);
  const timeSeriesQueries = getTimeSeriesQueries(queries);

  const mapAlarmQueriesToRequests = alarmQueries.flatMap((query) =>
    convertAlarmQueryToAlarmRequest(query)
  );

  const transformedAlarms = useAlarms({
    iotSiteWiseClient: alarmQueries.at(0)?.iotSiteWiseClient,
    iotEventsClient: alarmQueries.at(0)?.iotEventsClient,
    requests: mapAlarmQueriesToRequests,
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
      /** Bar chart cannot visualize raw data, so customize the resolution breakpoints as the default resolution */
      resolution: {
        [0]: '1m',
        [FIFTEEN_MIN_IN_MS]: '15m',
        [HOUR_IN_MS]: '1h',
        [DAY_IN_MS * 5]: '1d',
      },
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
    <BarChartBase
      widgetId=''
      dataStreams={dataStreams as DataStreamViz[]}
      axis={{
        showX: axis?.showX ?? true,
        showY: axis?.showY ?? true,
        labels: { yAxis: { content: axis?.yAxisLabel || '' } },
      }}
      viewport={{ ...utilizedViewport, group, lastUpdatedBy, yMin, yMax }}
      setViewport={setViewport}
      annotations={{
        y: allThresholds as YAnnotation[],
        thresholdOptions: {
          showColor: thresholdSettings?.colorBreachedData ?? true,
        },
      }}
      aggregationType={aggregationType}
      legend={DEFAULT_LEGEND}
      {...rest}
    />
  );
};
