import { rest } from 'msw';
import { LIST_ASSETS_PROPERTIES_URL } from './constants';
import { ASSET_HIERARCHY } from '../../resources/assets';
import { ListAssetPropertiesResponse } from '@aws-sdk/client-iotsitewise';

export function listAssetPropertiesHandler() {
  return rest.get(LIST_ASSETS_PROPERTIES_URL, (req, res, ctx) => {
    const { assetId } = req.params as { assetId: string };
    const asset = ASSET_HIERARCHY.findAssetById(assetId);

    if (!asset) {
      return res(ctx.status(404));
    }

    const response: ListAssetPropertiesResponse = {
      assetPropertySummaries: asset.assetProperties,
    };

    return res(ctx.delay(), ctx.status(200), ctx.json(response));
  });
}
