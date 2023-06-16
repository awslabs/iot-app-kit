import { type BatchGetAssetPropertyValueCommandInput } from '@aws-sdk/client-iotsitewise';

import { iotSiteWiseKey } from './sitewise';

/** Cache key factory for IoT SiteWise asset property values. */
export const assetPropertyValueKeys = {
  /** Cache key for all asset property value resources. */
  all: [{ ...iotSiteWiseKey[0], scope: 'asset property values' }] as const,

  /** Cache key for all batches of asset property values. */
  batchLatestValuesBatches: () => [{ ...assetPropertyValueKeys.all[0], resource: 'batch latest values' }] as const,

  /** Cache key for a single batch of asset property values. */
  batchLatestValues: (input: BatchGetAssetPropertyValueCommandInput) =>
    [{ ...assetPropertyValueKeys.batchLatestValuesBatches()[0], entries: input.entries }] as const,
};
