import {
  type StyleSettingsMap,
  type Threshold,
  type TimeSeriesDataQuery,
  type Viewport,
  type ThresholdSettings,
} from '@iot-app-kit/core';
import { LineChart as LineChartBase } from '@iot-app-kit/charts';
import type {
  DataStream as DataStreamViz,
  YAnnotation,
} from '@iot-app-kit/charts-core';
import {
  useViewport,
  useTimeSeriesData,
  DEFAULT_VIEWPORT,
  type AxisSettings,
  type ChartSize,
} from '@iot-app-kit/component-core';
import { DEFAULT_LEGEND, ECHARTS_GESTURE } from '../../common/constants';

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

  // if using echarts then echarts gesture overrides passed in viewport
  // else explicitly passed in viewport overrides viewport group
  const utilizedViewport =
    (lastUpdatedBy === ECHARTS_GESTURE
      ? viewport
      : passedInViewport || viewport) ?? DEFAULT_VIEWPORT;

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
