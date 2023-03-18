import React from 'react';
import { StyleSettingsMap, Threshold, TimeSeriesDataQuery, Viewport } from '@iot-app-kit/core';
import { StatusTimeline as StatusTimelineBaseWrongType, LineChart } from '@iot-app-kit-visualizations/react';
import type { DataStream as DataStreamViz, Annotations, Axis, LegendConfig } from '@iot-app-kit-visualizations/core';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { DEFAULT_VIEWPORT } from '../../common/constants';

// TODO: Remove this type assertion - iot-app-kit-visualizations has the wrong type for StatusTimeline
const StatusTimelineBase: typeof LineChart = StatusTimelineBaseWrongType as unknown as typeof LineChart;

export const StatusTimeline = ({
  queries,
  thresholds = [],
  viewport: passedInViewport,
  annotations: _annotations, // temporarily ignored.
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
      resolution: '0',
    },
    styles,
  });
  const { viewport } = useViewport();
  const allThresholds = [...queryThresholds, ...thresholds];

  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group

  return (
    <StatusTimelineBase
      widgetId=''
      dataStreams={dataStreams as DataStreamViz[]}
      viewport={utilizedViewport}
      annotations={{ y: allThresholds } as Annotations}
      {...rest}
    />
  );
};
