import { delay, http, HttpResponse } from 'msw';
import { ASSET_MODELS } from '../../resources/assetModels';
import { DESCRIBE_ASSET_MODEL_URL } from './constants';

export function describeAssetModelHandler() {
  return http.get(DESCRIBE_ASSET_MODEL_URL, async ({ params }) => {
    const { assetModelId } = params as { assetModelId: string };

    const assetModel = ASSET_MODELS.findByAssetModelId(assetModelId);

    if (!assetModel) {
      return HttpResponse.json(null, { status: 404 });
    }

    await delay();
    return HttpResponse.json(assetModel, { status: 200 });
  });
}
