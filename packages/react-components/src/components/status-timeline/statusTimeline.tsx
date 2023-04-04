import React from 'react';
import { StyleSettingsMap, Threshold, TimeSeriesDataQuery, Viewport } from '@iot-app-kit/core';
import { StatusTimeline as StatusTimelineBaseWrongType, LineChart } from '@iot-app-kit/charts';
import type { DataStream as DataStreamViz, Annotations } from '@iot-app-kit/charts-core';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { DEFAULT_LEGEND, DEFAULT_VIEWPORT } from '../../common/constants';

// TODO: Remove this type assertion - iot-app-kit/charts has the wrong type for StatusTimeline
const StatusTimelineBase: typeof LineChart = StatusTimelineBaseWrongType as unknown as typeof LineChart;

type StatusTimelineAxisSettings = { showX?: boolean };

export const StatusTimeline = ({
  queries,
  thresholds = [],
  viewport: passedInViewport,
  styles,
  ...rest
}: {
  queries: TimeSeriesDataQuery[];
  axis?: StatusTimelineAxisSettings;
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
  const { viewport, setViewport, group, lastUpdatedBy } = useViewport();
  const allThresholds = [...queryThresholds, ...thresholds];

  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group

  return (
    <StatusTimelineBase
      widgetId=''
      dataStreams={dataStreams as DataStreamViz[]}
      viewport={{ ...utilizedViewport, group, lastUpdatedBy }}
      annotations={{ y: allThresholds } as Annotations}
      setViewport={setViewport}
      legend={DEFAULT_LEGEND}
      {...rest}
    />
  );
};
