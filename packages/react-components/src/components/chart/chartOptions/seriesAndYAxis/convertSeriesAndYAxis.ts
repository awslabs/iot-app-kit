import {
  type DataPoint,
  type DataStream,
  type Threshold,
} from '@iot-app-kit/core';
import {
  type BarSeriesOption,
  type SeriesOption,
  type YAXisComponentOption,
} from 'echarts';

import {
  type ChartAxisOptions,
  type ChartDataQuality,
  type ChartOptions,
  type ChartStyleSettingsOptions,
  type Visualization,
} from '../../types';
import { convertStyles } from '../style/convertStyles';
import { convertYAxis as convertChartYAxis } from '../axes/yAxis';
import { convertThresholds } from '../convertThresholds';
import {
  type ChartStyleSettingsWithDefaults,
  type Emphasis,
} from '../../utils/getStyles';
import {
  createAlarmLabel,
  DEEMPHASIZE_OPACITY,
  EMPHASIZE_SCALE_CONSTANT,
} from '../../eChartsConstants';
import { type GenericSeries } from '../../../../echarts/types';
import { useMemo } from 'react';
import { useVisibleDataStreams } from '../../hooks/useVisibleDataStreams';
import { useHighlightedDataStreams } from '../../hooks/useHighlightedDataStreams';
import { convertSymbol } from './convertSymbol';
import { convertSymbolSize } from './convertSymbolSize';
import { convertColor } from './convertColor';

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
  { id, name }: Pick<DataStream, 'id' | 'name'>,
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
  {
    performanceMode,
    index,
    showBadDataIcons,
    showUncertainDataIcons,
    showAlarmIcons,
  }: {
    performanceMode?: boolean;
    index?: number;
    showAlarmIcons?: boolean;
  } & ChartDataQuality
) => {
  let opacity = emphasis === 'de-emphasize' ? DEEMPHASIZE_OPACITY : 1;
  if (hidden) {
    opacity = 0;
  }
  const scaledLineThickness =
    emphasis === 'emphasize'
      ? lineThickness + EMPHASIZE_SCALE_CONSTANT
      : lineThickness;
  const symbolStyle =
    visualizationType !== 'scatter' && performanceMode ? 'none' : symbol;

  const genericSeries = {
    id,
    name: name ?? id,
    datasetIndex: index,
    type: convertVisualizationType(visualizationType),
    step: convertStep(visualizationType),
    showSymbol: true,
    symbol: convertSymbol({
      symbolStyle,
      showBadDataIcons,
      showUncertainDataIcons,
    }),
    symbolSize: convertSymbolSize({
      emphasis,
      symbolSize,
      showBadDataIcons,
      showUncertainDataIcons,
    }),
    itemStyle: {
      ...convertColor({
        color: symbolColor ?? color,
        showBadDataIcons,
        showUncertainDataIcons,
      }),
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

    label: createAlarmLabel(significantDigits, showAlarmIcons),
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
    {
      performanceMode,
      index,
      showBadDataIcons,
      showUncertainDataIcons,
      showAlarmIcons,
    }: {
      performanceMode?: boolean;
      index: number;
      showAlarmIcons?: boolean;
    } & ChartDataQuality = {
      performanceMode: false,
      index: 0,
    }
  ) =>
  (datastream: Pick<DataStream, 'id' | 'name'>) => {
    const series = convertSeries(datastream, styles, {
      performanceMode,
      index,
      showBadDataIcons,
      showUncertainDataIcons,
      showAlarmIcons,
    });
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

type DataStreamInfo = Pick<DataStream, 'id' | 'name' | 'refId' | 'color'>;

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
  datastreams: DataStreamInfo[],
  {
    defaultVisualizationType,
    significantDigits,
    styleSettings,
    axis,
    thresholds,
    alarmThresholds,
    performanceMode,
    showBadDataIcons,
    showUncertainDataIcons,
    showAlarmIcons,
  }: Pick<
    ChartOptions,
    'defaultVisualizationType' | 'styleSettings' | 'significantDigits'
  > & {
    thresholds: Threshold[];
    axis?: ChartAxisOptions;
    performanceMode?: boolean;
    showAlarmIcons?: boolean;
    alarmThresholds: Threshold[];
  } & ChartDataQuality
) => {
  const { isDataStreamHidden } = useVisibleDataStreams();
  const { highlightedDataStreams, isDataStreamHighlighted } =
    useHighlightedDataStreams();

  return useMemo(() => {
    const defaultYAxis: YAXisComponentOption[] = [convertChartYAxis(axis)];
    const allThresholds = [...(thresholds ?? []), ...alarmThresholds];
    const convertedThresholds = convertThresholds(allThresholds);

    const shouldUseEmphasis = highlightedDataStreams.length > 0;

    /**
     * converting series styling and yAxis configuration
     * options for echarts the series is associated
     * with the dataset by index. Since both are
     * mapped from the datastream, they will
     * be in the same array order
     */
    const { series, yAxis } = datastreams
      .map((datastream, index) => {
        const isDatastreamHighlighted = isDataStreamHighlighted(datastream);
        const emphasis: Emphasis = shouldUseEmphasis
          ? isDatastreamHighlighted
            ? 'emphasize'
            : 'de-emphasize'
          : 'none';
        const hidden = isDataStreamHidden(datastream);
        const chartStylesWithDefaults = convertStyles({
          styleSettings,
          significantDigits,
          defaultVisualizationType,
          emphasis,
          hidden,
        })(datastream);

        return convertSeriesAndYAxis(chartStylesWithDefaults, {
          performanceMode,
          index,
          showBadDataIcons,
          showUncertainDataIcons,
          showAlarmIcons,
        })(datastream);
      })
      .reduce(reduceSeriesAndYAxis, { series: [], yAxis: defaultYAxis });

    if (series.length > 0) {
      series[0].markArea = convertedThresholds.markArea;
      series[0].markLine = convertedThresholds.markLine;
    }

    return {
      series,
      yAxis,
    };
  }, [
    datastreams,
    defaultVisualizationType,
    axis,
    significantDigits,
    styleSettings,
    performanceMode,
    thresholds,
    alarmThresholds,
    highlightedDataStreams,
    isDataStreamHighlighted,
    isDataStreamHidden,
    showBadDataIcons,
    showUncertainDataIcons,
    showAlarmIcons,
  ]);
};
