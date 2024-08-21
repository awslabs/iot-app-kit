import {
  type ListAssociatedAssetsResponse,
  type ListAssociatedAssetsRequest,
} from '@aws-sdk/client-iotsitewise';
import { rest } from 'msw';

import { LIST_ASSOCIATED_ASSETS_URL } from './constants';
import { ASSET_HIERARCHY } from '../../resources/assets';
import { summarizeAsset } from '../../resources/assets/summarizeAssetDescription';

export function listAssociatedAssetsHandler() {
  return rest.get<ListAssociatedAssetsRequest>(
    LIST_ASSOCIATED_ASSETS_URL,
    (req, res, ctx) => {
      const { assetId } = req.params as {
        assetId: ListAssociatedAssetsRequest['assetId'];
      };
      const traversalDirection =
        (req.url.searchParams.get(
          'traversalDirection'
        ) as ListAssociatedAssetsRequest['traversalDirection']) ?? 'CHILD';

      if (!assetId) {
        return res(ctx.status(400));
      }

      if (traversalDirection !== 'CHILD' && traversalDirection !== 'PARENT') {
        return res(ctx.status(400));
      }

      let assetSummaries: ListAssociatedAssetsResponse['assetSummaries'] = [];

      if (traversalDirection === 'CHILD') {
        const childAssets = ASSET_HIERARCHY.findChildren(assetId) ?? [];
        const childAssetSummaries = childAssets.map(summarizeAsset);
        assetSummaries = childAssetSummaries;
      } else if (traversalDirection === 'PARENT') {
        const parentAsset = ASSET_HIERARCHY.findParentAsset(assetId);
        const parentAssetSummary = parentAsset
          ? summarizeAsset(parentAsset)
          : undefined;

        assetSummaries = parentAssetSummary ? [parentAssetSummary] : [];
      }

      const response: ListAssociatedAssetsResponse = {
        assetSummaries: assetSummaries,
        nextToken: undefined,
      };

      return res(ctx.delay(), ctx.status(200), ctx.json(response));
    }
  );
}
