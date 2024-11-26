import isEqual from 'lodash-es/isEqual';
import uniqWith from 'lodash-es/uniqWith';
import type { BatchAggregatedEntry } from '../client/batchGetAggregatedPropertyDataPoints';
import type { BatchHistoricalEntry } from '../client/batchGetHistoricalPropertyDataPoints';
import type { BatchLatestEntry } from '../client/batchGetLatestPropertyDataPoints';

export type Entry =
  | BatchAggregatedEntry
  | BatchHistoricalEntry
  | BatchLatestEntry;

/**
 * Given a batch, or array of entries, deduplicate the batch.
 */
export function deduplicateBatch<T extends Entry>(batch: T[]): T[] {
  return uniqWith(batch, compareEntryUniqueness);
}

/**
 * Compares one entry to another, determining if the first is unique.
 */
function compareEntryUniqueness(a: Entry, b: Entry) {
  return isEqual(getEntryRequestInformation(a), getEntryRequestInformation(b));
}

/**
 * Gets relevant request information off the entry.
 */
function getEntryRequestInformation(entry: Entry) {
  const {
    refId: _refId,
    cacheSettings: _cacheSettings,
    ...requestInformationWithoutOmittedFields
  } = entry.requestInformation;

  return requestInformationWithoutOmittedFields;
}
