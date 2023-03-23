import React from 'react';
import { StyleSettingsMap, Threshold, TimeSeriesDataQuery, Viewport } from '@iot-app-kit/core';
import { BarChart as BarChartBase } from '@iot-app-kit-visualizations/react';
import type { Annotations, Axis, DataStream as DataStreamViz } from '@iot-app-kit-visualizations/core';
import { YAnnotation } from '@iot-app-kit-visualizations/core';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { DEFAULT_VIEWPORT } from '../../common/constants';
import { LegendConfig } from '@synchro-charts/core';

const HOUR_IN_MS = 1000 * 60 * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;

export const BarChart = ({
  queries,
  thresholds = [],
  viewport: passedInViewport,
  annotations: { thresholdOptions } = {}, // temporarily ignored all annotations but accept thresholdOptions
  styles,
  ...rest
}: {
  queries: TimeSeriesDataQuery[];
  annotations?: Annotations;
  axis?: Axis.Options;
  legend?: LegendConfig;
  thresholds?: Threshold[];
  viewport?: Viewport;
  styles?: StyleSettingsMap;
  gestures?: boolean;
}) => {
  const { dataStreams, thresholds: queryThresholds } = useTimeSeriesData({
    viewport: passedInViewport,
    queries,
    settings: {
      fetchFromStartToEnd: true,
      fetchMostRecentBeforeStart: true,
      /** Bar chart cannot visualize raw data, so customize the resolution breakpoints as the default resolution */
      resolution: {
        [0]: '1m',
        [HOUR_IN_MS]: '1hr',
        [DAY_IN_MS * 5]: '1day',
      },
    },
    styles,
  });
  const { viewport } = useViewport();
  const allThresholds = [...queryThresholds, ...thresholds];

  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group

  return (
    <BarChartBase
      widgetId=''
      dataStreams={dataStreams as DataStreamViz[]}
      viewport={utilizedViewport}
      annotations={{ y: allThresholds as YAnnotation[], thresholdOptions }}
      {...rest}
    />
  );
};
