import { bisector } from 'd3-array';

import { isValid } from './predicates';
import { isNumeric } from './number';
import { COMPARISON_OPERATOR, Threshold, Primitive } from '@iot-app-kit/core';

/**
 * Returns only thresholds defined for number
 * @param thresholds
 */
export const getNumberThresholds = (thresholds: Threshold[]): Threshold[] =>
  thresholds.filter((threshold) => isNumeric(threshold.value));

/**
 * Returns an array of the higher priority thresholds.
 *
 * If there is only one threshold with the higher priority severity, returns an
 * array with just that one threshold.
 *
 * If there are multiple thresholds with the same higher priority threshold,
 * returns an array with those thresholds.
 *
 * @param {Array.<Threshold>} t1Array
 * @param {Threshold} t2
 * @returns {Array.<Threshold>}
 */
export const isHigherPriorityThresholds = (t1Array: Threshold[], t2: Threshold): Threshold[] => {
  const t1Severity = t1Array[0]?.severity;
  const t2Severity = t2.severity;
  const t2Array = [t2];

  // If no highest priority thresholds yet, return t2 in array.
  if (t1Array.length === 0) {
    return t2Array;
  }

  // If no severity declared OR same severity level, return t1 array with t2 added.
  if ((t1Severity == null && t2Severity == null) || t1Severity === t2Severity) {
    t1Array.push(t2);
    return t1Array;
  }

  // If only t2 severity is declared, return t2 in an array.
  if (t1Severity == null) {
    return t2Array;
  }

  // If only t1 severity is declared, return t1 array.
  if (t2Severity == null) {
    return t1Array;
  }

  // If t1 severity is higher priority, return t1 array.
  // If t2 severity is higher priority, return new array with t2.
  return t1Severity < t2Severity ? t1Array : t2Array;
};

/**
 * Returns an array with the most important thresholds.
 *
 * The most important thresholds are the visuals which are most important to a user
 * This is determined via the `severity`. Lower severity means highest importance.
 *
 * If no thresholds are present with `severity`, an array with all thresholds is returned.
 *
 * @param {Array.<Threshold>} thresholds
 * @returns {Array.<Threshold>}
 */
export const highestPriorityThresholds = (thresholds: Threshold[]): Threshold[] => {
  return thresholds.reduce(isHigherPriorityThresholds, []);
};

export const isThresholdBreached = (value: Primitive, threshold: Threshold): boolean => {
  const dataStreamValue = isNumeric(value) ? Number(value) : value;
  const thresholdValue = isNumeric(threshold.value) ? Number(threshold.value) : threshold.value;
  const thresholdComparison = threshold.comparisonOperator;

  if (typeof dataStreamValue === 'number' && typeof thresholdValue === 'number') {
    switch (thresholdComparison) {
      case COMPARISON_OPERATOR.GT:
        return dataStreamValue > thresholdValue;

      case COMPARISON_OPERATOR.GTE:
        return dataStreamValue >= thresholdValue;

      case COMPARISON_OPERATOR.LT:
        return dataStreamValue < thresholdValue;

      case COMPARISON_OPERATOR.LTE:
        return dataStreamValue <= thresholdValue;

      case COMPARISON_OPERATOR.EQ:
        return dataStreamValue === thresholdValue;

      case COMPARISON_OPERATOR.CONTAINS:
        return false;

      default:
        throw new Error(`Unsupported number threshold comparison operator: ${thresholdComparison}`);
    }
  }

  if (typeof dataStreamValue === 'string' && typeof thresholdValue === 'string') {
    switch (thresholdComparison) {
      case COMPARISON_OPERATOR.GT:
      case COMPARISON_OPERATOR.GTE:
      case COMPARISON_OPERATOR.LT:
      case COMPARISON_OPERATOR.LTE:
        return false;

      case COMPARISON_OPERATOR.EQ:
        return dataStreamValue === thresholdValue;

      case COMPARISON_OPERATOR.CONTAINS:
        return dataStreamValue.includes(thresholdValue);

      default:
        throw new Error(`Unsupported string threshold comparison operator: ${thresholdComparison}`);
    }
  }

  if (typeof dataStreamValue === 'boolean' && typeof thresholdValue === 'boolean') {
    switch (thresholdComparison) {
      case COMPARISON_OPERATOR.GT:
      case COMPARISON_OPERATOR.GTE:
      case COMPARISON_OPERATOR.LT:
      case COMPARISON_OPERATOR.LTE:
      case COMPARISON_OPERATOR.CONTAINS:
        return false;

      case COMPARISON_OPERATOR.EQ:
        return dataStreamValue === thresholdValue;

      default:
        throw new Error(`Unsupported boolean threshold comparison operator: ${thresholdComparison}`);
    }
  }

  return false;
};

const thresholdBisector = bisector((threshold: Threshold) => threshold.value).left;

/**
 * This a map of comparison operator to order. The higher the order means higher the precedence.
 */
const operatorOrder = {
  [COMPARISON_OPERATOR.LTE]: 1,
  [COMPARISON_OPERATOR.LT]: 2,
  [COMPARISON_OPERATOR.GTE]: 3,
  [COMPARISON_OPERATOR.GT]: 4,
  [COMPARISON_OPERATOR.EQ]: 5,
  [COMPARISON_OPERATOR.CONTAINS]: 6,
};

/**
 * Given a list of thresholds, we sort the by the value of the threshold from least to greatest and
 * by the comparators order from least to greatest
 *
 * In the event of multiple thresholds with the same value, the threshold with the highest order will be the
 * one that takes precedence, and other rules colliding will be ignored.
 *
 * Below is an example of sorted threshold:
 *   2 2  2 2     5 5  5 5
 *  >= > <= <    >= > <= <
 */
export const sortThreshold = (thresholds: Threshold[]): Threshold[] =>
  [...thresholds].sort((a, b) => {
    if (a.value === b.value) {
      return operatorOrder[a.comparisonOperator] - operatorOrder[b.comparisonOperator];
    }
    // TODO: Fix this to work for all cases. value is not always a number or comparing to the same type
    return (a.value as number) - (b.value as number);
  });

/**
 * Gets the most relevant threshold which is considered breached by a given value.
 *
 * The most relevant threshold to a point is determined by the threshold value and its comparator.
 *
 * When there are two or more relevant thresholds to a point,
 *
 * 1) When the value is positive, then we will take the upper threshold, which is the greater one
 *
 * 2) When the value is negative, then we will take the lower threshold, which is the lesser one.
 */
export const getBreachedThreshold = (value: Primitive, thresholds: Threshold[]): Threshold | undefined => {
  if (thresholds.length === 0) {
    return undefined;
  }

  if (typeof value === 'string' || typeof value === 'boolean') {
    return thresholds.find((threshold) => isThresholdBreached(value, threshold)) || undefined;
  }

  /**
   * Filter by breached thresholds to remove the 'band' feature as the default.
   *
   * https://github.com/awslabs/synchro-charts/issues/153
   *
   * TO-DO: Add the 'in between operator' feature as one of the operator selections to consider
   * breached data points in between 2 thresholds.
   */
  const breachedThresholds = thresholds.filter((threshold) => isThresholdBreached(value, threshold));

  // Only consider the highest severity breached thresholds.
  const highestSeverityThresholds = highestPriorityThresholds(breachedThresholds);

  const numberThresholds = getNumberThresholds(highestSeverityThresholds);

  const sortedThresholds = sortThreshold(numberThresholds);
  const idx = thresholdBisector(sortedThresholds, value);

  let annotationLeft = sortedThresholds[idx - 1];
  let annotationRight = sortedThresholds[idx];

  // Special case when the idx is exactly the array length and that the last two thresholds are of the same value
  if (
    idx === numberThresholds.length &&
    numberThresholds.length > 1 &&
    sortedThresholds[idx - 1].value === sortedThresholds[idx - 2].value
  ) {
    annotationLeft = sortedThresholds[idx - 2];
    annotationRight = sortedThresholds[idx - 1];
  }

  // Special case when the idx is at 0 and that the first two values are of the same value.
  if (idx === 0 && numberThresholds.length > 1 && sortedThresholds[idx].value === sortedThresholds[idx + 1].value) {
    annotationLeft = sortedThresholds[idx];
    annotationRight = sortedThresholds[idx + 1];
  }

  if (annotationLeft == null && annotationRight == null) {
    return undefined;
  }

  if (annotationLeft != null && annotationRight == null) {
    return isThresholdBreached(value, annotationLeft) ? annotationLeft : undefined;
  }

  if (annotationLeft == null && annotationRight != null) {
    return isThresholdBreached(value, annotationRight) ? annotationRight : undefined;
  }

  if (isThresholdBreached(value, annotationLeft) && isThresholdBreached(value, annotationRight)) {
    return value >= 0 ? annotationRight : annotationLeft;
  }
  if (isThresholdBreached(value, annotationLeft) && !isThresholdBreached(value, annotationRight)) {
    return annotationLeft;
  }
  if (!isThresholdBreached(value, annotationLeft) && isThresholdBreached(value, annotationRight)) {
    return annotationRight;
  }

  return undefined;
};

export const isThreshold = isValid((maybeThreshold: Partial<Threshold>) => maybeThreshold.comparisonOperator != null);
