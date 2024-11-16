import { delay, http, HttpResponse } from 'msw';
import { LIST_ASSETS_PROPERTIES_URL } from './constants';
import { ASSET_HIERARCHY } from '../../resources/assets';
import { type ListAssetPropertiesResponse } from '@aws-sdk/client-iotsitewise';

export function listAssetPropertiesHandler() {
  return http.get(LIST_ASSETS_PROPERTIES_URL, async ({ params }) => {
    const { assetId } = params as { assetId: string };
    const asset = ASSET_HIERARCHY.findAssetById(assetId);

    if (!asset) {
      return HttpResponse.json(null, { status: 404 });
    }

    const response: ListAssetPropertiesResponse = {
      assetPropertySummaries: asset.assetProperties,
    };

    await delay();
    return HttpResponse.json(response, { status: 200 });
  });
}
