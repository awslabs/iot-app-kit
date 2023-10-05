import { rest } from 'msw';

import { DESCRIBE_ASSET_URL } from './constants';
import { ASSET_HIERARCHY } from '../../resources/assets';

export function describeAssetHandler() {
  return rest.get(DESCRIBE_ASSET_URL, (req, res, ctx) => {
    const { assetId } = req.params as { assetId: string };

    const asset = ASSET_HIERARCHY.findAssetById(assetId);

    if (!asset) {
      return res(ctx.status(404));
    }

    return res(ctx.delay(), ctx.status(200), ctx.json(asset));
  });
}
