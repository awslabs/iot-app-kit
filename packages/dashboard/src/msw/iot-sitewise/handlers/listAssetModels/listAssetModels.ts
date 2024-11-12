import { type ListAssetModelsResponse } from '@aws-sdk/client-iotsitewise';
import { delay, http, HttpResponse } from 'msw';

import { LIST_ASSET_MODELS_URL } from './constants';
import { ASSET_MODELS } from '../../resources/assetModels';
import { summarizeAssetModel } from '../../resources/assetModels/summarizeAssetModel';

export function listAssetModelsHandler() {
  return http.get(LIST_ASSET_MODELS_URL, async ({ request }) => {
    let assetModelSummaries = ASSET_MODELS.getAll().map(summarizeAssetModel);

    const url = new URL(request.url);
    if (url.search.includes('assetModelTypes=ASSET_MODEL')) {
      assetModelSummaries = assetModelSummaries?.filter(
        (summmary) => summmary.assetModelType !== 'COMPONENT_MODEL'
      );
    }

    const response: ListAssetModelsResponse = { assetModelSummaries };

    await delay();
    return HttpResponse.json(response, { status: 200 });
  });
}
