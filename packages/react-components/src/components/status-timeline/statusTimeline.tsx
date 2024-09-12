import React from 'react';
import {
  StyleSettingsMap,
  Threshold,
  TimeSeriesDataQuery,
  Viewport,
} from '@iot-app-kit/core';
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
  queries: TimeSeriesDataQuery[];
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

  // if using echarts then echarts gesture overrides passed in viewport
  // else explicitly passed in viewport overrides viewport group
  const utilizedViewport =
    (lastUpdatedBy === ECHARTS_GESTURE
      ? viewport
      : passedInViewport || viewport) ?? DEFAULT_VIEWPORT;

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
