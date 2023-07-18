import React from 'react';
import { StyleSettingsMap, Threshold, TimeSeriesDataQuery, Viewport, ThresholdSettings } from '@iot-app-kit/core';
import { LineChart as LineChartBase } from '@iot-app-kit/charts';
import type { DataStream as DataStreamViz, YAnnotation } from '@iot-app-kit/charts-core';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import { DEFAULT_LEGEND, DEFAULT_VIEWPORT } from '../../common/constants';
import { AxisSettings, ChartSize } from '../../common/chartTypes';

export interface LineChartProps {
  queries: TimeSeriesDataQuery[];
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

export const LineChart = (props: LineChartProps) => {
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
    <LineChartBase
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
        thresholdOptions: { showColor: thresholdSettings?.colorBreachedData ?? true },
      }}
      aggregationType={aggregationType}
      legend={DEFAULT_LEGEND}
      {...rest}
    />
  );
};
