/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import {
  type StyleSettingsMap,
  type Threshold,
  type Viewport,
  type ThresholdSettings,
  type ResolutionConfig,
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
import { getTimeSeriesQueries } from '../../utils/queries';
import {
  type AxisSettings,
  type ChartSize,
  type ComponentQuery,
} from '../../common/chartTypes';
import { type AssistantProperty } from '../../common/assistantProps';
import { Title, getAdjustedChartHeight } from '../../common/title';
import { useBarChartAlarms, useNormalizedDataStreams } from './hooks';

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
  assistant?: AssistantProperty;
  titleText?: string;
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
    chartSize,
    ...rest
  } = props;

  const { viewport, setViewport, group, lastUpdatedBy } = useViewport();

  // if using echarts then echarts gesture overrides passed in viewport
  // else explicitly passed in viewport overrides viewport group
  const utilizedViewport =
    (lastUpdatedBy === ECHARTS_GESTURE
      ? viewport
      : passedInViewport || viewport) ?? DEFAULT_VIEWPORT;

  /** Bar chart cannot visualize raw data, so customize the resolution breakpoints as the default resolution */
  const resolutionConfig: ResolutionConfig = {
    [0]: '1m',
    [FIFTEEN_MIN_IN_MS]: '15m',
    [HOUR_IN_MS]: '1h',
    [DAY_IN_MS * 5]: '1d',
  };

  const alarms = useBarChartAlarms({
    queries,
    viewport: utilizedViewport,
    resolutionConfig,
  });
  const alarmThresholds = useMemo(
    () =>
      alarms
        .map((alarm) => alarm.thresholds)
        .filter((threshold) => !!threshold),
    [alarms]
  );

  const timeSeriesQueries = getTimeSeriesQueries(queries);
  const { dataStreams: timeSeriesDataStreams, thresholds: queryThresholds } =
    useTimeSeriesData({
      viewport: passedInViewport,
      queries: timeSeriesQueries,
      settings: {
        fetchFromStartToEnd: true,
        fetchMostRecentBeforeStart: true,
        resolution: resolutionConfig,
      },
      styles,
    });

  const dataStreams = useNormalizedDataStreams({
    dataStreams: timeSeriesDataStreams,
    alarms,
  });

  const allThresholds = useMemo(
    () => [...queryThresholds, ...thresholds, ...alarmThresholds],
    [
      JSON.stringify(queryThresholds),
      JSON.stringify(thresholds),
      JSON.stringify(alarmThresholds),
    ]
  );

  const getAdjustedChartSize = () => {
    if (!chartSize) return undefined;

    return {
      ...chartSize,
      height: getAdjustedChartHeight(!!rest.titleText, chartSize.height),
    };
  };

  return (
    <div style={{ height: 'inherit' }}>
      <Title text={rest.titleText} style={{ paddingLeft: '1rem' }} />
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
        size={getAdjustedChartSize()}
        {...rest}
      />
    </div>
  );
};
