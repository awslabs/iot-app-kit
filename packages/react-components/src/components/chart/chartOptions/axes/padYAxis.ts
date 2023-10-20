import { DataPoint, DataStream, Threshold } from '@iot-app-kit/core';

import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';

import { ScaleDataValue } from 'echarts/types/src/util/types';
import { dataValue } from '../seriesAndYAxis/convertSeriesAndYAxis';
import { YAxisOptions } from '../../types';

const PADDING_FACTOR = 0.1;

type AxisValue =
  | ScaleDataValue
  | 'dataMin'
  | 'dataMax'
  | ((extent: { min: number; max: number }) => ScaleDataValue)
  | undefined;

// Verify that the input value is a valid number
export const validateValue = (value: string | undefined) => {
  return value !== undefined ? +value : undefined;
};

// Convert a threshold to a data point with a y value
const thresholdToDataPoint = (threshold: Threshold): DataPoint => {
  const value = validateValue(threshold.value.toString());
  return { x: 0, y: value !== undefined ? value : 0 };
};

// Calculate the order of magnitude of a number
const orderOfMagnitude = (n: number): number => {
  const o = Math.log10(Math.abs(n));
  return Math.ceil(o);
};

// Round a decimal up to the closest order of magnitude of 10
// Ex: 0.00123 --> 0.001
const roundDecimalToMagnitude = (decimal: number): string => {
  if (decimal === 0) {
    return '0';
  }
  const roundedUpMag = Math.abs(orderOfMagnitude(decimal) - 1);
  return decimal.toFixed(roundedUpMag);
};

// Calculate a number's power of 10
// Ex: 5432 --> 1000, 42 --> 10
const roundedMagnitudeOfTen = (n: number) => {
  const m = orderOfMagnitude(n) - 1;
  return n > 0 ? 10 ** m : -1 * 10 ** m;
};

// Round number to closest magnitude
const roundToOrderOfMagnitude = (n: number): number => {
  if (n === 0) {
    return 0;
  }
  const roundedMag = roundedMagnitudeOfTen(n);
  const a = n / roundedMag;
  const b = roundedMag;
  return Math.ceil(a) * b;
};

/**
 * Padding cases:
 * 1. min and max are undefined, don't need to do any padding
 * 2. min is undefined, max is defined. Need to pad max, default min is the min of data if < 0 or 0
 * 3. min is defined, max is undefined. Need to pad min, default max is the max of data if > 0 or 0
 * 4. Both are defined, need to pad both
 */
const applyPadding = (min: AxisValue, max: AxisValue, padMin: boolean, padMax: boolean, data: DataPoint[]) => {
  let maxPadding = 0;
  let minPadding = 0;
  const minValue = (min ? validateValue(min.toString()) : 0) ?? 0;
  const maxValue = (max ? validateValue(max.toString()) : 0) ?? 0;

  if (!min && max && padMax) {
    // If only max is defined then pad max
    const dataMin = minBy(data, dataValue);
    const dataMinValue = (dataMin && validateValue(dataMin.y.toString())) ?? 0;
    const dataDiff = dataMinValue < 0 ? maxValue - dataMinValue : maxValue;
    maxPadding = PADDING_FACTOR * roundedMagnitudeOfTen(dataDiff);
  } else if (min && !max && padMin) {
    // If only min is defined then pad min
    const dataMax = maxBy(data, dataValue);
    const dataMaxValue = (dataMax && validateValue(dataMax.y.toString())) ?? 0;
    const dataDiff = dataMaxValue > 0 ? dataMaxValue - minValue : minValue;
    minPadding = PADDING_FACTOR * roundedMagnitudeOfTen(dataDiff);
  } else if (min && max && padMin && padMax) {
    // If both are defined then pad both
    minPadding = maxPadding = PADDING_FACTOR * roundedMagnitudeOfTen(maxValue - minValue);
  }

  // Don't round values if they are set manually
  if (minPadding === 0 && maxPadding === 0) {
    return [minValue, maxValue];
  }

  // Round the padded values to the closest order of magnitude of 10, and round off any decimals
  const resultMin = roundDecimalToMagnitude(roundToOrderOfMagnitude(minValue - minPadding));
  const resultMax = roundDecimalToMagnitude(roundToOrderOfMagnitude(maxValue + maxPadding));
  return [+resultMin, +resultMax];
};

/**
 * Calculate the absolute min and max of the chart based on the existing data and thresholds.
 * If the default yAxis already has a min or max then it takes priority and will not be updated.
 * Otherwise, if there are thresholds that are outside the default yAxis set a new min and max
 * to display them with some padding on either side.
 *
 * @param yAxis is the default yAxis of the chart
 * @param thresholds are the list of thresholds defined on the chart
 * @param datastreams are the properties with data on the chart
 * @returns a new yAxis with min and max updated based on the padded absolute min and max
 */
export const padYAxis = (yAxis: YAxisOptions, thresholds: Threshold[], datastreams: DataStream[]) => {
  // Combine datastreams and thresholds into a flat list of DataPoints
  const thresholdsData = thresholds.map((t) => thresholdToDataPoint(t));
  const initData: DataPoint[] = [];
  const data = datastreams.reduce((acc, datastream) => [...acc, ...datastream.data], initData);
  const combinedData = [...thresholdsData, ...data];

  let { yMin, yMax } = yAxis;
  // Only calculate new min/max if there are thresholds that can be out of bounds
  if (thresholds.length > 0) {
    let padMin = false;
    if (yMin === undefined) {
      const dataMin: DataPoint | undefined = minBy(combinedData, dataValue);
      const dataMinValue = dataMin && validateValue(dataMin.y.toString());
      if (dataMinValue && dataMinValue < 0) {
        yMin = dataMinValue;
        padMin = true;
      }
    }

    let padMax = false;
    if (yMax === undefined) {
      const dataMax: DataPoint | undefined = maxBy(combinedData, dataValue);
      const dataMaxValue = dataMax && validateValue(dataMax.y.toString());
      if (dataMaxValue && dataMaxValue > 0) {
        yMax = dataMaxValue;
        padMax = true;
      }
    }

    [yMin, yMax] = applyPadding(yMin, yMax, padMin, padMax, combinedData);
  }

  return [yMin, yMax];
};
