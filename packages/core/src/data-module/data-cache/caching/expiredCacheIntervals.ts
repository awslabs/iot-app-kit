import type { Interval } from '../../../common/intervalStructure';
import { intersect } from '../../../common/intervalStructure';
import type { HistoricalRequest, TTLDurationMapping } from '../types';

/**
 * Given a mapping of caching rules and the number of milliseconds behind present time,
 * return intervals represent which caches are expired
 */
export const getExpiredCacheIntervals = (
  ttlDurationMapping: TTLDurationMapping,
  { start, end, requestedAt }: HistoricalRequest
): Interval[] => {
  const sortedCaches = Object.keys(ttlDurationMapping)
    .map((duration) => ({
      duration: Number(duration),
      ttl: ttlDurationMapping[Number(duration)],
    }))
    .reverse();
  const now = Date.now();
  const timeSinceRequest = now - requestedAt.getTime();

  // get the active cache rule
  const caches = sortedCaches.filter(
    ({ duration, ttl }) =>
      timeSinceRequest <= duration && timeSinceRequest > ttl
  );

  // If there are no active cache rules, then there are no expired cache intervals
  if (caches.length === 0) {
    return [];
  }

  const expiredIntervals = caches.map(
    ({ duration, ttl }) => [now - duration, now - ttl] as Interval
  );

  return intersect(expiredIntervals, [[start.getTime(), end.getTime()]]);
};
