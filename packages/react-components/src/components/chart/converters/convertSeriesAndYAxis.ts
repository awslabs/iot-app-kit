import { DataStream } from '@iot-app-kit/core';
import { ChartStyleSettingsOptions } from '../types';
import { SeriesOption, YAXisComponentOption } from 'echarts';
import { convertDataPoint } from './convertDataPoint';

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
  { data, name, id }: DataStream,
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
    /**
     * showing the axis only to ensure that the horizontal
     * mark lines are visible
     * 
     * axis label refers to the numbers at each mark line
     */
    show: true,
    axisLabel: { show: false },
    name: yAxis.yAxisLabel,
    min: yAxis.yMin,
    max: yAxis.yMax,
    alignTicks: true,
    axisLine: {
      lineStyle: {
        color: color,
      },
    },
  };

export const convertSeriesAndYAxis =
  (styles: ChartStyleSettingsOptions) =>
  ({ refId, ...dataStream }: DataStream) => {
    const series = convertSeries(dataStream, styles);
    const yAxis = convertYAxis({ ...styles });

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
