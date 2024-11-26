import {
  type ListAssociatedAssetsRequest,
  type ListAssociatedAssetsResponse,
} from '@aws-sdk/client-iotsitewise';
import { delay, http, HttpResponse } from 'msw';
import { ASSET_HIERARCHY } from '../../resources/assets';
import { summarizeAsset } from '../../resources/assets/summarizeAssetDescription';
import { LIST_ASSOCIATED_ASSETS_URL } from './constants';

export function listAssociatedAssetsHandler() {
  return http.get(LIST_ASSOCIATED_ASSETS_URL, async ({ request, params }) => {
    const { assetId } = params as {
      assetId: ListAssociatedAssetsRequest['assetId'];
    };

    const url = new URL(request.url);
    const traversalDirection =
      (url.searchParams.get(
        'traversalDirection'
      ) as ListAssociatedAssetsRequest['traversalDirection']) ?? 'CHILD';

    if (!assetId) {
      return HttpResponse.json(null, { status: 400 });
    }

    if (traversalDirection !== 'CHILD' && traversalDirection !== 'PARENT') {
      return HttpResponse.json(null, { status: 400 });
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

    await delay();
    return HttpResponse.json(response, { status: 200 });
  });
}
