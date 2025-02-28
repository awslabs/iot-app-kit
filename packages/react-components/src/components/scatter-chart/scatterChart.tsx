import { ScatterChart as ScatterChartBase } from '@iot-app-kit/charts';
import type {
  DataStream as DataStreamViz,
  YAnnotation,
} from '@iot-app-kit/charts-core';
import {
  type StyleSettingsMap,
  type Threshold,
  type ThresholdSettings,
  type TimeSeriesDataQuery,
  type Viewport,
} from '@iot-app-kit/core';
import { DEFAULT_LEGEND, ECHARTS_GESTURE } from '../../common/constants';
import {
  DEFAULT_VIEWPORT,
  useViewport,
  useTimeSeriesData,
  type AxisSettings,
  type ChartSize,
} from '@iot-app-kit/component-core';

export interface ScatterChartProps {
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

export const ScatterChart = (props: ScatterChartProps) => {
  const {
    queries,
    thresholds = [],
    viewport: passedInViewport,
    thresholdSettings,
    axis,
    yMin,
    yMax,
    styles,
    aggregationType,
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
    <ScatterChartBase
      widgetId=''
      dataStreams={dataStreams as DataStreamViz[]}
      axis={{
        showX: axis?.showX ?? true,
        showY: axis?.showY ?? true,
        labels: { yAxis: { content: axis?.yAxisLabel || '' } },
      }}
      aggregationType={aggregationType}
      viewport={{ ...utilizedViewport, group, lastUpdatedBy, yMin, yMax }}
      annotations={{
        y: allThresholds as YAnnotation[],
        thresholdOptions: {
          showColor: thresholdSettings?.colorBreachedData ?? true,
        },
      }}
      setViewport={setViewport}
      legend={DEFAULT_LEGEND}
      {...rest}
    />
  );
};
