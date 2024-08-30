import { useQuery } from '@tanstack/react-query';

import {
  PARENT_TRAVERSAL_DIRECTION,
  SINGLE_PARENT_MAX_RESULTS,
} from './constants';
import type { ParentAsset } from './types';
import { transformListAssetsResponse } from '../../../helpers/response-transformers';
import { resourceExplorerQueryClient } from '../../../requests';
import type { ListAssociatedAssets } from '@iot-app-kit/core';
import type { AssetResource } from '../../../types/resources';

export interface UseAssetHierarchyPathOptions {
  parentAsset?: ParentAsset;
  listAssociatedAssets: ListAssociatedAssets;
}

export interface UseAssetHierarchyPathResult {
  ancestorAssets: AssetResource[];
  isLoading: boolean;
}

export function useAncestorAssets({
  parentAsset,
  listAssociatedAssets,
}: UseAssetHierarchyPathOptions): UseAssetHierarchyPathResult {
  const parentAssetId = parentAsset?.assetId ?? '';

  const { data: ancestorAssets = [], isFetching: isLoading } = useQuery(
    {
      enabled: Boolean(parentAssetId),
      queryKey: [{ resourceId: 'AssetHierarchyPath', parentAssetId }],
      queryFn: async () => {
        return recursivelyGetAncestorAssets(parentAssetId);

        async function recursivelyGetAncestorAssets(
          assetId: string,
          ancestorAssets: AssetResource[] = []
        ): Promise<AssetResource[]> {
          const response = await listAssociatedAssets({
            assetId,
            traversalDirection: PARENT_TRAVERSAL_DIRECTION,
            maxResults: SINGLE_PARENT_MAX_RESULTS,
          });
          const [ancestorAsset] = transformListAssetsResponse(response);

          // No more ancestors to request (termination clause)
          if (!ancestorAsset) {
            return ancestorAssets;
          }

          return recursivelyGetAncestorAssets(ancestorAsset.assetId, [
            ancestorAsset,
            ...ancestorAssets,
          ]);
        }
      },
    },
    resourceExplorerQueryClient
  );

  return { ancestorAssets, isLoading };
}
