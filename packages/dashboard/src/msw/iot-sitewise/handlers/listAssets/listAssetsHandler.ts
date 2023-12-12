import { type AssetSummary, type ListAssetsResponse } from '@aws-sdk/client-iotsitewise';
import { rest } from 'msw';

import { LIST_ASSETS_URL } from './constants';
import { ASSET_HIERARCHY } from '../../resources/assets';
import { summarizeAsset } from '../../resources/assets/summarizeAssetDescription';

export function listAssetsHandler() {
  return rest.get(LIST_ASSETS_URL, (_req, res, ctx) => {
    const url = new URL(_req.url);
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

    return res(ctx.delay(), ctx.status(200), ctx.json(response));
  });
}
