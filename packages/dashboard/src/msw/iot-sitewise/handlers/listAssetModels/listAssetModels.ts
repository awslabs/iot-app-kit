import { type ListAssetModelsResponse } from '@aws-sdk/client-iotsitewise';
import { rest } from 'msw';

import { LIST_ASSET_MODELS_URL } from './constants';
import { ASSET_MODELS } from '../../resources/assetModels';
import { summarizeAssetModel } from '../../resources/assetModels/summarizeAssetModel';

export function listAssetModelsHandler() {
  return rest.get(LIST_ASSET_MODELS_URL, (_req, res, ctx) => {
    let assetModelSummaries = ASSET_MODELS.getAll().map(summarizeAssetModel);
    if (_req.url.search.includes('assetModelTypes=ASSET_MODEL')) {
      assetModelSummaries = assetModelSummaries?.filter(
        (summmary) => summmary.assetModelType !== 'COMPONENT_MODEL'
      );
    }
    const response: ListAssetModelsResponse = { assetModelSummaries };

    return res(ctx.delay(), ctx.status(200), ctx.json(response));
  });
}
