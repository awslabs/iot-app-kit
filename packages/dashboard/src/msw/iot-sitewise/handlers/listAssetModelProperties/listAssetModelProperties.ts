import { delay, http, HttpResponse } from 'msw';
import { LIST_ASSET_MODEL_PROPERTIES_URL } from './constants';
import { ASSET_MODELS } from '../../resources/assetModels';
import { type ListAssetModelPropertiesResponse } from '@aws-sdk/client-iotsitewise';

export function listAssetModelPropertiesHandler() {
  return http.get(LIST_ASSET_MODEL_PROPERTIES_URL, async ({ params }) => {
    const { assetModelId } = params as { assetModelId: string };

    const assetModel = ASSET_MODELS.findByAssetModelId(assetModelId);

    if (!assetModel) {
      return HttpResponse.json(null, { status: 404 });
    }

    const response: ListAssetModelPropertiesResponse = {
      assetModelPropertySummaries: assetModel.assetModelProperties,
    };

    await delay();
    return HttpResponse.json(response, { status: 200 });
  });
}
