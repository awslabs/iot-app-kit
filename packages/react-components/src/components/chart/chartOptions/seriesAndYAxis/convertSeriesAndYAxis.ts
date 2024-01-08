import { DataPoint, DataStream, Threshold } from '@iot-app-kit/core';
import { BarSeriesOption, SeriesOption, YAXisComponentOption } from 'echarts';

import {
  ChartAxisOptions,
  ChartStyleSettingsOptions,
  Visualization,
} from '../../types';
import { convertDataPoint } from '../convertDataPoint';
import {
  StyleSettingsMap,
  getChartStyleSettingsFromMap,
} from '../style/convertStyles';
import { convertYAxis as convertChartYAxis } from '../axes/yAxis';
import { convertThresholds } from '../convertThresholds';
import { ChartStyleSettingsWithDefaults } from '../../utils/getStyles';
import {
  DEEMPHASIZE_OPACITY,
  EMPHASIZE_SCALE_CONSTANT,
} from '../../eChartsConstants';
import { GenericSeries } from '../../../../echarts/types';

export const dataValue = (point: DataPoint) => point.y;

const stepTypes: NonNullable<ChartStyleSettingsOptions['visualizationType']>[] =
  ['step-end', 'step-middle', 'step-start'];
const convertVisualizationType = (
  visualizationType: Required<
    Pick<ChartStyleSettingsOptions, 'visualizationType'>
  >['visualizationType']
) => (stepTypes.includes(visualizationType) ? 'line' : visualizationType);

const convertStep = (
  visualizationType: Required<
    Pick<ChartStyleSettingsOptions, 'visualizationType'>
  >['visualizationType']
) => {
  if (!stepTypes.includes(visualizationType)) return false;
  switch (visualizationType) {
    case 'step-start':
      return 'start';
    case 'step-end':
      return 'end';
    case 'step-middle':
      return 'middle';
    default:
      return false;
  }
};

const addVisualizationSpecificOptions = (
  visualizationType: Visualization,
  series: SeriesOption
) => {
  switch (visualizationType) {
    case 'bar':
      return {
        ...series,
        barGap: '0%',
        barWidth: '10%',
        barCategoryGap: '0%',
      } as BarSeriesOption;
    default:
      return series;
  }
};

const convertSeries = (
  { data, id, name }: DataStream,
  {
    visualizationType,
    color,
    symbol,
    symbolColor,
    symbolSize,
    lineStyle,
    lineThickness,
    emphasis,
    significantDigits,
    hidden,
  }: ChartStyleSettingsWithDefaults,
  { performanceMode }: { performanceMode?: boolean }
) => {
  let opacity = emphasis === 'de-emphasize' ? DEEMPHASIZE_OPACITY : 1;
  if (hidden) {
    opacity = 0;
  }
  const scaledSymbolSize =
    emphasis === 'emphasize'
      ? symbolSize + EMPHASIZE_SCALE_CONSTANT
      : symbolSize;
  const scaledLineThickness =
    emphasis === 'emphasize'
      ? lineThickness + EMPHASIZE_SCALE_CONSTANT
      : lineThickness;
  const symbolStyle =
    visualizationType !== 'scatter' && performanceMode ? 'none' : symbol;

  const genericSeries = {
    id,
    name: name ?? id,
    data: data.map(convertDataPoint),
    type: convertVisualizationType(visualizationType),
    step: convertStep(visualizationType),
    symbol: symbolStyle,
    symbolSize: scaledSymbolSize,
    itemStyle: {
      color: symbolColor ?? color,
      opacity,
    },
    lineStyle: {
      color,
      type: lineStyle,
      width: scaledLineThickness,
      opacity,
    },
    animation: false,
    appKitSignificantDigits: significantDigits,
    appKitColor: color,
  } as GenericSeries;

  return addVisualizationSpecificOptions(visualizationType, genericSeries);
};

const convertYAxis = ({
  color,
  yAxis,
}: ChartStyleSettingsOptions): YAXisComponentOption | undefined =>
  yAxis && {
    /**
     * showing the axis only to ensure that the horizontal
     * mark lines are visible
     *
     * axis label refers to the numbers at each mark line
     */
    show: true,
    axisLabel: { show: false },
    name: yAxis.yLabel,
    min: yAxis.yMin,
    max: yAxis.yMax,
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
export const convertSeriesAndYAxis =
  (
    styles: ChartStyleSettingsWithDefaults,
    { performanceMode }: { performanceMode?: boolean } = {
      performanceMode: false,
    }
  ) =>
  (datastream: DataStream) => {
    const series = convertSeries(datastream, styles, { performanceMode });
    const yAxis = convertYAxis(styles);

    return {
      series,
      yAxis,
    };
  };

const addYAxisIndex = <T extends SeriesOption>(
  series: T,
  yAxisIndex = 0
): T => ({
  ...series,
  yAxisIndex,
});

type SeriesAndYAxis = ReturnType<ReturnType<typeof convertSeriesAndYAxis>>;

type ReducedSeriesAndYAxis = {
  series: SeriesAndYAxis['series'][];
  yAxis: NonNullable<SeriesAndYAxis['yAxis']>[];
};

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
    performanceMode,
  }: {
    styleSettings: StyleSettingsMap;
    thresholds: Threshold[];
    axis?: ChartAxisOptions;
    performanceMode?: boolean;
  }
) => {
  const defaultYAxis: YAXisComponentOption[] = [convertChartYAxis(axis)];
  const convertedThresholds = convertThresholds(thresholds);
  const getStyles = getChartStyleSettingsFromMap(styleSettings);

  const { series, yAxis } = datastreams
    .map((datastream) =>
      convertSeriesAndYAxis(getStyles(datastream), { performanceMode })(
        datastream
      )
    )
    .reduce(reduceSeriesAndYAxis, { series: [], yAxis: defaultYAxis });

  if (series.length > 0) {
    series[0].markArea = convertedThresholds.markArea;
    series[0].markLine = convertedThresholds.markLine;
  }

  return {
    series,
    yAxis,
  };
};
