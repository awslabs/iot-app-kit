import {
  MINUTE_IN_MS,
  SECOND_IN_MS,
  parseDuration,
} from '../../../common/time';
import { getDataStreamStore } from '../getDataStreamStore';
import {
  addInterval,
  intersect,
  subtractIntervals,
} from '../../../common/intervalStructure';
import { type AggregateType } from '@aws-sdk/client-iotsitewise';
import { getExpiredCacheIntervals } from './expiredCacheIntervals';
import { pointBisector } from '../../../common/dataFilters';
import type {
  DataPoint,
  Primitive,
  RequestInformation,
  RequestInformationAndRange,
} from '../../types';
import type {
  Interval,
  IntervalStructure,
} from '../../../common/intervalStructure';
import type {
  CacheSettings,
  DataStreamsStore,
  DataStreamStore,
  TTLDurationMapping,
} from '../types';
import type {
  TimeSeriesDataRequestSettings,
  TimeSeriesDataRequest,
} from '../requestTypes';

export const unexpiredCacheIntervals = (
  streamStore: DataStreamStore,
  ttlDurationMapping: TTLDurationMapping
): Interval[] => {
  const expiredCacheIntervals = streamStore.requestHistory
    .map((historicalRequest) =>
      getExpiredCacheIntervals(ttlDurationMapping, historicalRequest)
    )
    .flat();

  const allCachedIntervals = streamStore.requestCache.intervals;
  return allCachedIntervals
    .map((interval) => subtractIntervals(interval, expiredCacheIntervals))
    .flat();
};

// What is considered 'too close', and will cause intervals to merge together.
// One minute was tested on it's impact for data requesting on SWM.
const TOO_CLOSE_MS = MINUTE_IN_MS;
// Don't request anything with less than a second - SiteWise API will return 400
// as it will think the start and the end date are the same if they are not
// far enough apart.
const MINIMUM_INTERVAL = SECOND_IN_MS * 3;

/**
 * Combine Short Intervals
 *
 * Combines intervals of time, to reduce the fracturing of small data-requests,
 * which can cause to excessive network requests.
 *
 * Usually it is better to simply over-request by a couple minutes of data, than initiating more network requests.
 *
 * Assumes combined intervals are sorted, in a strictly ascending order.
 */
const combineShortIntervals = (
  combinedIntervals: Interval[],
  interval: Interval
): Interval[] => {
  if (combinedIntervals.length === 0) {
    return [interval];
  }
  const [start, end] = interval;
  const [lastStart, lastEnd] = combinedIntervals[combinedIntervals.length - 1];

  const intervalsAreClose = start - lastEnd < TOO_CLOSE_MS;
  if (!intervalsAreClose) {
    return [...combinedIntervals, interval];
  }

  // combine the last two intervals into one.
  return [...combinedIntervals.slice(0, -1), [lastStart, end]];
};

/**
 * Returns all the date ranges that need to be requested.
 * Returns empty list if there are no date ranges needed to be requested.
 *
 * This takes into account what date intervals for a given stream id and resolution exist,
 * allowing us to only request what is needed
 */
export const getDateRangesToRequest = ({
  store,
  dataStreamId,
  start,
  end,
  resolution,
  cacheSettings,
  aggregationType,
}: {
  store: DataStreamsStore;
  dataStreamId: string;
  start: Date;
  end: Date;
  resolution: number;
  cacheSettings: CacheSettings;
  aggregationType?: AggregateType;
}): [Date, Date][] => {
  const streamStore = getDataStreamStore(
    dataStreamId,
    resolution,
    store,
    aggregationType
  );

  if (end.getTime() === start.getTime()) {
    // nothing to request
    return [];
  }

  if (streamStore == null) {
    // There is no data present at all, so we know we need to simply request all of the data.
    return [[start, end]];
  }

  // NOTE: Use the request cache since we don't want to request intervals that already have been requested.
  const cacheIntervals = unexpiredCacheIntervals(
    streamStore,
    cacheSettings.ttlDurationMapping
  );
  const millisecondIntervals = subtractIntervals(
    [start.getTime(), end.getTime()],
    cacheIntervals
  );

  return millisecondIntervals
    .reduce(combineShortIntervals, [])
    .filter(([startMs, endMs]) => endMs - startMs > MINIMUM_INTERVAL)
    .map(
      ([startMS, endMS]) => [new Date(startMS), new Date(endMS)] as [Date, Date]
    );
};

/**
 * Returns all the request information required
 * Returns empty list if there are no date ranges needed to be requested.
 *
 * This takes into account what date intervals for a given stream id and resolution exist,
 * allowing us to only request what is needed.
 *
 * It also includes all the request behaviour pertaining to each date range.
 */
export const getRequestInformations = ({
  request,
  store,
  dataStreamId,
  start,
  meta,
  end,
  resolution,
  aggregationType,
  cacheSettings,
}: {
  request: TimeSeriesDataRequest;
  store: DataStreamsStore;
  dataStreamId: string;
  start: Date;
  end: Date;
  aggregationType?: AggregateType;
  meta?: RequestInformation['meta'];
  resolution: string;
  cacheSettings: CacheSettings;
}): RequestInformationAndRange[] => {
  // get sorted date ranges that need to be requested
  const dateRanges = getDateRangesToRequest({
    store,
    dataStreamId,
    start,
    end,
    aggregationType,
    resolution: parseDuration(resolution),
    cacheSettings,
  });

  let requestInformations: RequestInformationAndRange[] = [];

  const fetchFromStartToEnd = request.settings?.fetchFromStartToEnd;

  // convert date ranges to request information
  if (fetchFromStartToEnd) {
    requestInformations = dateRanges.map(([rangeStart, rangeEnd]) => ({
      start: rangeStart,
      end: rangeEnd,
      id: dataStreamId,
      meta,
      resolution,
      aggregationType,
      fetchFromStartToEnd,
    }));
  }

  // fetchMostRecentBeforeEnd if a recent point doesn't exist in the cache, even with no request informations
  if (
    request.settings?.fetchMostRecentBeforeEnd &&
    !checkCacheForRecentPoint({
      store,
      dataStreamId,
      aggregationType,
      resolution: parseDuration(resolution),
      start: end,
      cacheSettings,
    })
  ) {
    requestInformations.push({
      start,
      end,
      meta,
      id: dataStreamId,
      resolution,
      fetchMostRecentBeforeEnd: true,
      aggregationType,
    });
  }

  // fetch a leading point if needed and there is no recent point in cache before the start date
  if (
    request.settings?.fetchMostRecentBeforeStart &&
    !checkCacheForRecentPoint({
      store,
      dataStreamId,
      aggregationType,
      resolution: parseDuration(resolution),
      start,
      cacheSettings,
    })
  ) {
    requestInformations.unshift({
      start,
      end,
      meta,
      id: dataStreamId,
      resolution,
      fetchMostRecentBeforeStart: true,
      aggregationType,
    });
  }

  return requestInformations;
};

export const dataPointCompare = <T extends Primitive = number>(
  a: DataPoint<T>,
  b: DataPoint<T>
) => {
  const aTime = a.x;
  const bTime = b.x;
  if (aTime !== bTime) {
    return aTime - bTime;
  }
  if (typeof a.y === 'number' && typeof b.y === 'number') {
    return a.y - b.y;
  }
  const upperA = (a.y as string).toUpperCase();
  const upperB = (b.y as string).toUpperCase();
  if (upperA < upperB) {
    return -1;
  }
  if (upperA > upperB) {
    return 1;
  }
  return 0;
};

export const EMPTY_CACHE: IntervalStructure<DataPoint<Primitive>> = {
  intervals: [],
  items: [],
};

/**
 * DataPoint Cache
 *
 * A wrapper around an interval structure.
 */

export type DataPointCache = IntervalStructure<DataPoint<Primitive>>;

export const createDataPointCache = ({
  start,
  end,
  data = [],
}: {
  start: Date;
  end: Date;
  data?: DataPoint[];
}): DataPointCache => ({
  intervals: [[start.getTime(), end.getTime()]],
  items: [data],
});

export const addToDataPointCache = ({
  start,
  end,
  data = [],
  cache,
}: {
  start: Date;
  end: Date;
  cache: DataPointCache;
  data?: DataPoint[];
}): DataPointCache => {
  if (data.length === 0 && start.getTime() === end.getTime()) {
    return cache;
  }
  return addInterval(
    cache,
    [start.getTime(), end.getTime()],
    data,
    dataPointCompare
  );
};

export const checkCacheForRecentPoint = ({
  store,
  dataStreamId,
  resolution,
  start,
  cacheSettings,
  aggregationType,
}: {
  store: DataStreamsStore;
  dataStreamId: string;
  resolution: number;
  start: Date;
  cacheSettings: CacheSettings;
  aggregationType?: AggregateType;
}) => {
  const streamStore = getDataStreamStore(
    dataStreamId,
    resolution,
    store,
    aggregationType
  );

  if (streamStore && streamStore.dataCache.intervals.length > 0) {
    const { dataCache } = streamStore;
    const cacheIntervals = unexpiredCacheIntervals(
      streamStore,
      cacheSettings.ttlDurationMapping
    );
    const intersectedIntervals = intersect(cacheIntervals, dataCache.intervals);

    const interval = intersectedIntervals.find(
      (inter) => inter[0] <= start.getTime() && start.getTime() <= inter[1]
    );

    if (interval) {
      const dataPoints = dataCache.items.flat();

      const elementIndex = pointBisector.right(dataPoints, start);
      return (
        elementIndex !== 0 && dataPoints[elementIndex - 1].x >= interval[0]
      );
    }
    return false;
  }
  return false;
};

// Validates request config to see if we need to make a fetch Request
// This will expand in future to accomodate more requestConfig variants
export const validateRequestConfig = (
  requestConfig: TimeSeriesDataRequestSettings | undefined
) => {
  if (requestConfig) {
    return requestConfig.fetchMostRecentBeforeStart;
  }

  return false;
};

// Returns the maximum duration for possible uncached data for given CacheSettings
export const maxCacheDuration = (cacheSettings: CacheSettings) => {
  const ttlDurations = Object.keys(cacheSettings.ttlDurationMapping).map(
    (key) => Number(key)
  );

  if (ttlDurations.length === 0) {
    return 0;
  }

  return Math.max(...ttlDurations);
};
