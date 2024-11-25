import {
  type AssetSummary,
  type ListAssetsResponse,
} from '@aws-sdk/client-iotsitewise';
import { delay, http, HttpResponse } from 'msw';
import { ASSET_HIERARCHY } from '../../resources/assets';
import { summarizeAsset } from '../../resources/assets/summarizeAssetDescription';
import { LIST_ASSETS_URL } from './constants';

export function listAssetsHandler() {
  return http.get(LIST_ASSETS_URL, async ({ request }) => {
    const url = new URL(request.url);
    const assetModelId = url.searchParams.get('assetModelId');
    let assetSummaries: AssetSummary[] = [];
    if (assetModelId) {
      const assets = ASSET_HIERARCHY.getAssetsByAssetModelId(assetModelId);
      assetSummaries = assets.map(summarizeAsset);
    } else {
      const rootAssets = ASSET_HIERARCHY.getRootAssets();
      assetSummaries = rootAssets.map(summarizeAsset);
    }

    const response: ListAssetsResponse = {
      assetSummaries: assetSummaries,
      nextToken: undefined,
    };

    await delay();
    return HttpResponse.json(response, { status: 200 });
  });
}
