import React from 'react';
import {
  StyleSettingsMap,
  Threshold,
  TimeSeriesDataQuery,
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
import { AxisSettings, ChartSize } from '../../common/chartTypes';

const HOUR_IN_MS = 1000 * 60 * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;
const FIFTEEN_MIN_IN_MS = 15 * 60 * 1000;
export interface BarChartProps {
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
  refreshRate?: number;
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
    refreshRate,
    ...rest
  } = props;

  const { dataStreams, thresholds: queryThresholds } = useTimeSeriesData({
    viewport: passedInViewport,
    queries,
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
      refreshRate,
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
