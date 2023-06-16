import {
  type DescribeAssetCommandInput,
  type ListAssetsCommandInput,
  type ListAssociatedAssetsCommandInput,
} from '@aws-sdk/client-iotsitewise';

import { iotSiteWiseKey } from './sitewise';

/** Cache key factory for IoT SiteWise assets.  */
export const assetKeys = {
  /** Cache key for all asset resources. */
  all: [{ ...iotSiteWiseKey[0], scope: 'assets' }] as const,

  /** Cache key for all asset summaries returned by ListAssets. */
  lists: () => [{ ...assetKeys.all[0], resource: 'asset summary' }] as const,

  /** Cache key for an asset summary list returned by ListAssets. */
  list: (input: ListAssetsCommandInput) =>
    [{ ...assetKeys.lists()[0], filter: input.filter, assetModelId: input.assetModelId }] as const,

  /** Cache key for all asset summaries returned by ListAssociatedAssets. */
  associatedLists: () => [{ ...assetKeys.all[0], resource: 'associated asset summary' }] as const,

  /** Cache key for an asset summary list returned by ListAssociatedAssets. */
  associatedList: ({ assetId, hierarchyId, traversalDirection }: ListAssociatedAssetsCommandInput) =>
    [{ ...assetKeys.associatedLists()[0], assetId, hierarchyId, traversalDirection }] as const,

  /** Cache key for all asset descriptions. */
  descriptions: () => [{ ...assetKeys.all[0], resource: 'asset description' }] as const,

  /** Cache key for an asset description. */
  description: (input: DescribeAssetCommandInput) =>
    [{ ...assetKeys.descriptions()[0], assetId: input.assetId }] as const,
};
