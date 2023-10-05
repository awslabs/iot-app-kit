import { rest } from 'msw';

import { DESCRIBE_ASSET_MODEL_URL } from './constants';
import { ASSET_MODELS } from '../../resources/assetModels';

export function describeAssetModelHandler() {
  return rest.get(DESCRIBE_ASSET_MODEL_URL, (req, res, ctx) => {
    const { assetModelId } = req.params as { assetModelId: string };

    const assetModel = ASSET_MODELS.find((assetModel) => assetModel.assetModelId === assetModelId);

    if (!assetModel) {
      return res(ctx.status(404));
    }

    return res(ctx.delay(), ctx.status(200), ctx.json(assetModel));
  });
}
