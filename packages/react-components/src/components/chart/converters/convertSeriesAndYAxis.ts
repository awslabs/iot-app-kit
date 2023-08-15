import { useMemo } from 'react';
import { DataStream, Threshold } from '@iot-app-kit/core';
import { SeriesOption, YAXisComponentOption } from 'echarts';

import { ChartAxisOptions, ChartStyleSettingsOptions } from '../types';
import { convertDataPoint } from './convertDataPoint';
import { StyleSettingsMap, getChartStyleSettingsFromMap } from './convertStyles';
import { convertYAxis as convertChartYAxis } from './convertAxis';
import { convertThresholds } from './convertThresholds';

const stepTypes: NonNullable<ChartStyleSettingsOptions['visualizationType']>[] = [
  'step-end',
  'step-middle',
  'step-start',
];
const convertVisualizationType = (
  visualizationType: Required<Pick<ChartStyleSettingsOptions, 'visualizationType'>>['visualizationType']
) => (stepTypes.includes(visualizationType) ? 'line' : visualizationType);

const convertStep = (
  visualizationType: Required<Pick<ChartStyleSettingsOptions, 'visualizationType'>>['visualizationType']
) => {
  if (!stepTypes.includes(visualizationType)) return false;

  let step;
  switch (visualizationType) {
    case 'step-start':
      step = 'start';
      break;
    case 'step-end':
      step = 'end';
      break;
    case 'step-middle':
      step = 'middle';
      break;
  }

  return step;
};

const convertSeries = (
  { data, id, name }: DataStream,
  { visualizationType, color, symbol, symbolColor, symbolSize, lineStyle, lineThickness }: ChartStyleSettingsOptions
) =>
  ({
    id,
    name: name,
    data: data.map(convertDataPoint),
    type: convertVisualizationType(visualizationType ?? 'line'),
    step: convertStep(visualizationType ?? 'line'),
    symbol,
    symbolSize,
    itemStyle: {
      color: symbolColor ?? color,
    },
    lineStyle: {
      color,
      type: lineStyle,
      width: lineThickness,
    },
  } as SeriesOption);

const convertYAxis = ({ color, yAxis }: ChartStyleSettingsOptions): YAXisComponentOption | undefined =>
  yAxis && {
    show: false,
    name: yAxis.yAxisLabel,
    min: yAxis.yMin,
    max: yAxis.yMax,
    position: 'right',
    alignTicks: true,
    axisLine: {
      lineStyle: {
        color: color,
      },
    },
  };

/**
 * converts series and yAxis together using the same style settings
 */
export const convertSeriesAndYAxis = (styles: ChartStyleSettingsOptions) => (dataStream: DataStream) => {
  const series = convertSeries(dataStream, styles);
  const yAxis = convertYAxis(styles);

  return {
    series,
    yAxis,
  };
};

const addYAxisIndex = <T extends SeriesOption>(series: T, yAxisIndex = 0): T => ({
  ...series,
  yAxisIndex,
});

type SeriesAndYAxis = ReturnType<ReturnType<typeof convertSeriesAndYAxis>>;

type ReducedSeriesAndYAxis = { series: SeriesAndYAxis['series'][]; yAxis: NonNullable<SeriesAndYAxis['yAxis']>[] };

/**
 * flatten converted series and yAxis for each datastream
 * into a single series and yAxis list for Echarts
 *
 * if a series has a custom yAxis, associate the series
 * to the yAxis by setting the correct index map per echarts spec
 * https://echarts.apache.org/en/option.html#series-line.yAxisIndex
 */
export const reduceSeriesAndYAxis = (
  acc: ReducedSeriesAndYAxis,
  { series, yAxis }: SeriesAndYAxis
): ReducedSeriesAndYAxis => {
  /**
   * Link series to the y axis if it has one
   * the default axis is first in the list
   */
  const yAxisIndex = yAxis ? acc.yAxis.length : 0;

  return {
    series: [...acc.series, addYAxisIndex(series, yAxisIndex)],
    yAxis: yAxis ? [...acc.yAxis, yAxis] : [...acc.yAxis],
  };
};

/**
 *
 * @param chartRef echarts reference
 * @param datastreams latest value for datastreams
 * @param { styleSettings, axis }
 *
 * hook to convert datastreams into echarts series option.
 *
 * @returns { series, yAxis } converted series options and converted yAxis options
 */
export const useSeriesAndYAxis = (
  datastreams: DataStream[],
  {
    styleSettings,
    axis,
    thresholds,
  }: { styleSettings: StyleSettingsMap; thresholds: Threshold[]; axis?: ChartAxisOptions }
) => {
  const defaultSeries: SeriesOption[] = [];
  const defaultYAxis: YAXisComponentOption[] = useMemo(() => [convertChartYAxis(axis)], [axis]);
  const convertedThresholds = convertThresholds(thresholds);

  const getStyles = getChartStyleSettingsFromMap(styleSettings);

  const { series, yAxis } = useMemo(() => {
    const { series: mappedSeries, yAxis: mappedYAxis } = datastreams
      .map((datastream) => convertSeriesAndYAxis(getStyles(datastream))(datastream))
      .reduce(reduceSeriesAndYAxis, { series: defaultSeries, yAxis: defaultYAxis });

    return { series: mappedSeries, yAxis: mappedYAxis };
  }, [datastreams, styleSettings, defaultYAxis]);

  if (series.length > 0) {
    series[0].markArea = convertedThresholds.markArea;
    series[0].markLine = convertedThresholds.markLine;
  }

  return { series, yAxis };
};
