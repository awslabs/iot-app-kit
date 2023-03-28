import React from 'react';
import { StyleSettingsMap, Threshold, TimeSeriesDataQuery, Viewport } from '@iot-app-kit/core';
import { ScatterChart as ScatterChartBase } from '@iot-app-kit/charts';
import type { Annotations, Axis, DataStream as DataStreamViz } from '@iot-app-kit/charts-core';
import { YAnnotation } from '@iot-app-kit/charts-core';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { DEFAULT_VIEWPORT } from '../../common/constants';
import { LegendConfig } from '@synchro-charts/core';

export const ScatterChart = ({
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
    },
    styles,
  });
  const { viewport, setViewport, group, lastUpdatedBy } = useViewport();
  const allThresholds = [...queryThresholds, ...thresholds];

  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group

  return (
    <ScatterChartBase
      widgetId=''
      dataStreams={dataStreams as DataStreamViz[]}
      viewport={{ ...utilizedViewport, group, lastUpdatedBy }}
      annotations={{ y: allThresholds as YAnnotation[], thresholdOptions }}
      setViewport={setViewport}
      {...rest}
    />
  );
};
