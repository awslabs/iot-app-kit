import { type AssetSummary } from '@aws-sdk/client-iotsitewise';
import type { WithAbortSignal, WithIoTSiteWiseClient } from '../../../../types';

import { getParentAsset } from './getParentAsset';

export interface ListParentAssetsInput extends WithAbortSignal, WithIoTSiteWiseClient {
  /** The ID of the asset to get the parent assets for. */
  assetId: string;
}

/** List all of an assets parents up to the root of the asset hierarchy. */
export function listParentAssets({ assetId, signal, client }: ListParentAssetsInput) {
  async function recursivelyGetParentAssets(
    assetId: string,
    parentAssets: AssetSummary[] = []
  ): Promise<AssetSummary[]> {
    const parentAsset = await getParentAsset({ client, assetId, signal });

    // termination condition
    if (parentAsset == null || parentAsset.id == null) {
      return parentAssets;
    }

    // build up the list of parent assets recursively
    return recursivelyGetParentAssets(parentAsset.id, [parentAsset, ...parentAssets]);
  }

  // begin recursion
  return recursivelyGetParentAssets(assetId);
}
