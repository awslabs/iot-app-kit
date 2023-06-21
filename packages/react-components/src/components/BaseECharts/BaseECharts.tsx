import React, { useMemo } from 'react';
import {
  StyleSettingsMap,
  Threshold,
  TimeSeriesDataQuery,
  Viewport,
  ThresholdSettings,
  DataPoint,
} from '@iot-app-kit/core';
import { DataStream } from '@iot-app-kit/charts-core';
import type { SeriesOption } from 'echarts';

import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { AxisSettings } from '../../common/chartTypes';
import { DEFAULT_ECHART_OPTIONS, DEFAULT_X_AXIS, DEFAULT_Y_AXIS } from './eChartsConstants';
import { StreamType } from '../../common/constants';
import { useECharts } from '../../hooks/useECharts';

// specifically converts dataStreams to series for bar, scatter, line charts
const dataStreamsToEChartSeries = (dataStreams: DataStream[], chartType: string): SeriesOption[] => {
  return dataStreams
    .filter(({ streamType }) => streamType !== StreamType.ALARM) // need to filter out alarm streams. not supported in bar, scatter, line
    .map(
      (stream) =>
        ({
          name: stream.name ?? '',
          data: stream.data.map((point: DataPoint) => [point.x, point.y]),
          type: chartType,
          itemStyle: { color: stream.color } ?? {},
          lineStyle: { color: stream.color } ?? {},
        } as SeriesOption)
    );
};

export interface BaseEChartsProps {
  queries: TimeSeriesDataQuery[];
  chartType: 'line' | 'bar' | 'scatter';
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  yMin?: number;
  yMax?: number;
  thresholds?: Threshold[];
  viewport?: Viewport;
  styles?: StyleSettingsMap;
  aggregationType?: string;
  gestures?: boolean;
  size?: { width: number; height: number };
}

export const BaseECharts = ({
  queries,
  yMin,
  yMax,
  axis,
  viewport: passedInViewport,
  styles,
  chartType,
  size,
}: BaseEChartsProps) => {
  const { dataStreams } = useTimeSeriesData({
    viewport: passedInViewport,
    queries,
    settings: {
      fetchFromStartToEnd: true,
      fetchMostRecentBeforeStart: true,
    },
    styles,
  });

  const series = useMemo(
    () => dataStreamsToEChartSeries(dataStreams as DataStream[], chartType),
    [dataStreams, chartType]
  );

  const option = useMemo(
    () => ({
      ...DEFAULT_ECHART_OPTIONS,
      xAxis: { ...DEFAULT_X_AXIS, show: axis?.showX ?? true },
      yAxis: {
        ...DEFAULT_Y_AXIS,
        show: axis?.showY ?? true,
        min: yMin,
        max: yMax,
      },
      title: {
        text: series.length === 0 ? `${chartType} chart - no data present` : '',
      },
      series,
    }),
    [series, chartType, yMin, yMax, axis]
  );

  const { ref } = useECharts({ option, size });

  return <div ref={ref} />;
};
