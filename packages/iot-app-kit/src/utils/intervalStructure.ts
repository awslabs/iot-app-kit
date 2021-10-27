import { simplify, substract, intersect as intersectFn } from 'intervals-fn';
import { IntervalSE } from 'intervals-fn/es/data.structures';

export type Interval = [number, number];

export type IntervalStructure<T> = {
  // Intervals are always sorted, and have no overlap (even on boundaries)
  intervals: Interval[];
  // Data associated with each interval
  items: T[][];
};

/**
 * If compareFn(a, b) returns less than 0, sort a to an index lower than b (i.e. a comes first).
 * If compareFn(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements. Note: the ECMAscript standard does not guarantee this behavior, thus, not all browsers (e.g. Mozilla versions dating back to at least 2003) respect this.
 * If compareFn(a, b) returns greater than 0, sort b to an index lower than a (i.e. b comes first).
 */
type CompareFn<T> = (a: T, b: T) => number;

const toObjectNotation = ([start, end]: Interval): IntervalSE => ({ start, end });
const toIntervalNotation = ({ start, end }: IntervalSE): Interval => [start, end] as Interval;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isBeforeInterval = ([_, aEnd]: Interval, [bStart]: Interval): boolean => aEnd < bStart;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isAfterInterval = ([aStart]: Interval, [_, bEnd]: Interval): boolean => aStart > bEnd;
const isIntersecting = (a: Interval, b: Interval): boolean => !isBeforeInterval(a, b) && !isAfterInterval(a, b);

export const isContained = <T>(structure: IntervalStructure<T>, interval: Interval): boolean =>
  structure.intervals.some(([start, end]) => start <= interval[0] && end >= interval[1]);

export const intersect = (aIntervals: Interval[], bIntervals: Interval[]): Interval[] => {
  const intersectedIntervals = simplify(
    intersectFn(aIntervals.map(toObjectNotation), bIntervals.map(toObjectNotation))
  );
  return intersectedIntervals.map(toIntervalNotation);
};

export const subtractIntervals = (interval: Interval, intervals: Interval[]): Interval[] => {
  const sortedIntervals = intervals.sort((i1, i2) => i1[0] - i2[0]).map(toObjectNotation);
  const subtractedIntervals = substract([toObjectNotation(interval)], simplify(sortedIntervals));
  return simplify(subtractedIntervals)
    .filter(inter => inter.start < inter.end)
    .map(toIntervalNotation);
};

/**
 * Merges together to lists of items given a way to compare items.
 *
 * Returns back a single list of items, sorted by `compare`, with no duplicates.
 *
 * `aItems` and `bItems` are assumed to be sorted by `compare`.
 *
 * If `aItems` and `bItems` have overlap, always take the items specified in `aItems`
 */
export const mergeItems = <T>(aItems: T[], bItems: T[], compare: CompareFn<T>) => {
  // Empty items edge cases
  if (aItems.length === 0) {
    return bItems;
  }
  if (bItems.length === 0) {
    return aItems;
  }
  // Non-overlapping interval merge cases
  if (compare(aItems[0], bItems[bItems.length - 1]) > 0) {
    return [...bItems, ...aItems];
  }
  if (compare(aItems[aItems.length - 1], bItems[0]) < 0) {
    return [...aItems, ...bItems];
  }
  // Fully contained edge cases
  if (compare(aItems[0], bItems[0]) <= 0 && compare(aItems[aItems.length - 1], bItems[bItems.length - 1]) >= 0) {
    // `aItems` fully contains `bItems`
    return aItems;
  }
  if (compare(bItems[0], aItems[0]) <= 0 && compare(bItems[bItems.length - 1], aItems[aItems.length - 1]) >= 0) {
    // `bItems` fully contains `aItems`
    const itemsBeforeA = bItems.filter(item => compare(item, aItems[0]) < 0);
    const itemsAfterA = bItems.filter(item => compare(item, aItems[aItems.length - 1]) > 0);
    return [...itemsBeforeA, ...aItems, ...itemsAfterA];
  }

  // Merge items
  if (compare(aItems[0], bItems[0]) < 0) {
    // `aItems` interval begins before `bItems`
    return [...aItems, ...bItems.filter(x => compare(x, aItems[aItems.length - 1]) > 0)];
  }
  // `bItems` interval begins before `aItems`
  return [...bItems.filter(x => compare(x, aItems[0]) < 0), ...aItems];
};

export const addInterval = <T>(
  intervalStructure: IntervalStructure<T>,
  interval: Interval,
  items: T[],
  compare: CompareFn<T>
): IntervalStructure<T> => {
  const overlappingIntervals = intervalStructure.intervals
    .map((i, index) => ({
      interval: i,
      index,
    }))
    .filter(({ interval: i }) => isIntersecting(interval, i));

  // Combine all overlapping intervals into a single interval
  const combinedInterval = overlappingIntervals.reduce(
    (mergedInterval: Interval, { interval: currInterval }: { interval: Interval; index: number }) =>
      [Math.min(mergedInterval[0], currInterval[0]), Math.max(mergedInterval[1], currInterval[1])] as Interval,
    interval
  );

  // Combine all elements from all overlapping intervals
  const combinedItems = overlappingIntervals.reduce(
    (mergedItems: T[], { index }: { interval: Interval; index: number }) =>
      mergeItems(mergedItems, intervalStructure.items[index], compare),
    items
  );

  // Get Insert Points
  const i = intervalStructure.intervals.findIndex(
    int => isBeforeInterval(interval, int) || isIntersecting(interval, int)
  );
  const insertIndex = i >= 0 ? i : intervalStructure.intervals.length;

  // Apply update
  const updatedIntervals = [...intervalStructure.intervals];
  updatedIntervals.splice(insertIndex, overlappingIntervals.length, combinedInterval);
  const updatedItems = [...intervalStructure.items];
  updatedItems.splice(insertIndex, overlappingIntervals.length, combinedItems);
  return {
    intervals: updatedIntervals,
    items: updatedItems,
  };
};
