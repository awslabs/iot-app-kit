import { rest } from 'msw';
import { LIST_ASSET_MODEL_PROPERTIES_URL } from './constants';
import { ASSET_MODELS } from '../../resources/assetModels';
import { type ListAssetModelPropertiesResponse } from '@aws-sdk/client-iotsitewise';

export function listAssetModelPropertiesHandler() {
  return rest.get(LIST_ASSET_MODEL_PROPERTIES_URL, (req, res, ctx) => {
    const { assetModelId } = req.params as { assetModelId: string };

    const assetModel = ASSET_MODELS.findByAssetModelId(assetModelId);

    if (!assetModel) {
      return res(ctx.status(404));
    }

    const response: ListAssetModelPropertiesResponse = {
      assetModelPropertySummaries: assetModel.assetModelProperties,
    };

    return res(ctx.delay(), ctx.status(200), ctx.json(response));
  });
}
