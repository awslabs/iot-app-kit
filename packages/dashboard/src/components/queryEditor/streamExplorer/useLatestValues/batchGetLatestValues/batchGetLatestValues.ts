import { batchGetAssetPropertyValue } from './batchGetAssetPropertyValue';
import { extractLatestValuesFromBatch } from './extractLatestValuesFromBatch';
import type { BatchGetLatestValuesEntry, SuccessValue, SkippedValue, ErrorValue } from './types';
import type { WithAbortSignal, WithIoTSiteWiseClient } from '../../../types';

export interface BatchGetLatestValuesInput extends WithAbortSignal, WithIoTSiteWiseClient {
  entries: BatchGetLatestValuesEntry[];
}

/** Get a list of the latest values for a list of given asset properties (entries). */
export async function batchGetLatestValues({
  entries,
  signal,
  client,
}: BatchGetLatestValuesInput): Promise<(SuccessValue | SkippedValue | ErrorValue)[]> {
  const {
    successEntries = [],
    skippedEntries = [],
    errorEntries = [],
  } = await batchGetAssetPropertyValue({ entries, signal, client });

  const { successValues, skippedValues, errorValues } = extractLatestValuesFromBatch({
    entries,
    successEntries,
    skippedEntries,
    errorEntries,
  });

  return [...successValues, ...skippedValues, ...errorValues];
}
