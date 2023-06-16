import { MAX_BATCH_SIZE } from './constants';
import type { AssetPropertyIdentifier, BatchGetLatestValuesEntry } from './types';

/** Create requests batches for BatchGetAssetPropertyValue. */
export function createBatches(assetProperties: AssetPropertyIdentifier[]): BatchGetLatestValuesEntry[][] {
  const entries = createBatchEntries(assetProperties);
  const batches = chunkBatches(entries);

  return batches;
}

function createBatchEntries(assetProperties: AssetPropertyIdentifier[]): BatchGetLatestValuesEntry[] {
  const entries = assetProperties.map(({ propertyId, assetId }) => ({
    // entry ID needs to be unique - property ID is not unique across assets
    // the asset ID is pre-pended to the property ID to ensure uniqueness
    entryId: `${(assetId ?? '').slice(0, 8)}--${propertyId}`,
    assetId,
    propertyId,
  }));

  return entries;
}

function chunkBatches(entries: BatchGetLatestValuesEntry[]): BatchGetLatestValuesEntry[][] {
  const batches = [];

  for (let i = 0; i < entries.length; i += MAX_BATCH_SIZE) {
    const chunk = entries.slice(i, i + MAX_BATCH_SIZE);

    batches.push(chunk);
  }

  return batches;
}
