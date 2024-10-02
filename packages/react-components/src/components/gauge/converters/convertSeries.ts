import { Threshold } from '@iot-app-kit/core';
import { GaugeConfigurationOptions } from '../types';
import { convertThresholdsToEchartsValuePair } from '../utils/convertThresholdsToEchartsValuePair';
import { getPreciseValue } from '../../../utils/getPreciseValue';
import {
  DEFAULT_EMPTY_SERIES,
  DEFAULT_GAUGE_PROGRESS_COLOR,
  DEFAULT_PROGRESS_SERIES,
  DEFAULT_THRESHOLD_SERIES,
} from '../constants';

export const convertSeries = ({
  unit,
  significantDigits,
  thresholds,
  settings,
}: GaugeConfigurationOptions) => {
  const hasThresholds = Boolean(
    // hasThresholds filters if value is an empty string, EQ and CONTAINS operators since they are not supported as gauge thresholds
    thresholds?.filter(
      (t: Threshold) =>
        t.comparisonOperator !== 'EQ' &&
        t.comparisonOperator !== 'CONTAINS' &&
        t.value !== ''
    )?.length ?? 0 > 0
  );

  const gaugeThresholds = hasThresholds
    ? convertThresholdsToEchartsValuePair({ settings, thresholds })
    : null;

  const getFormatterValue = (value: number) => {
    if (!value) return undefined;
    return `{value|${getPreciseValue(value, significantDigits)}} ${
      settings?.showUnit && unit ? '{unit| ' + unit + '}' : ''
    }`;
  };

  const emptySeries = {
    ...DEFAULT_EMPTY_SERIES,
    min: settings?.yMin ?? 0,
    max: settings?.yMax ?? 100,
    axisLine: {
      lineStyle: {
        width: settings?.gaugeThickness ?? 30,
        color: [[1, '#D5DBDB']],
      },
    },
  };

  const progressSeries = {
    ...DEFAULT_PROGRESS_SERIES,
    min: settings?.yMin ?? 0,
    max: settings?.yMax ?? 100,
    itemStyle: {
      color: hasThresholds
        ? gaugeThresholds
        : settings?.color ?? DEFAULT_GAUGE_PROGRESS_COLOR,
    },
    progress: {
      show: true,
      width: settings?.gaugeThickness ?? 30,
    },
    detail: {
      valueAnimation: false, // no animation while value changes
      offsetCenter: [0, '-10%'], // position of the center value
      fontSize: 25, // font size of the center value in px
      fontWeight: '500', // font weight of the center value in px
      color: 'inherit', // color of the center value
      show: !hasThresholds,
      formatter: !hasThresholds ? getFormatterValue : '{value}',
      rich: {
        value: {
          fontSize: 0,
        },
        unit: {
          fontSize: 0,
        },
      },
    },
  };

  const thresholdSeries = {
    ...DEFAULT_THRESHOLD_SERIES,
    min: settings?.yMin ?? 0,
    max: settings?.yMax ?? 100,
    itemStyle: {
      color: gaugeThresholds,
    },
    axisLine: {
      lineStyle: {
        width: -3,
        color: gaugeThresholds,
      },
    },
    detail: {
      /**
       * center value settings for color, position, animation, value font size, font weigth and unit size, font weight etc..
       */
      valueAnimation: false, // no animation while value changes
      offsetCenter: [0, '-10%'], // position of the center value
      fontSize: 25, //font size of the center value
      fontWeight: '500', //font weight of the center value
      formatter: getFormatterValue ?? '{value}', //formatter for the center value
      color: 'inherit', //color of the center value
      rich: {
        value: {
          fontSize: 0,
        },
        unit: {
          fontSize: 0,
        },
      },
    },
  };

  return hasThresholds
    ? [emptySeries, progressSeries, thresholdSeries]
    : [emptySeries, progressSeries];
};
