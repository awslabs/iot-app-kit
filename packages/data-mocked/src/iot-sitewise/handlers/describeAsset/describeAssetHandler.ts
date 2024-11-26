import { delay, http, HttpResponse } from 'msw';
import { ASSET_HIERARCHY } from '../../resources/assets';
import { DESCRIBE_ASSET_URL } from './constants';

export function describeAssetHandler() {
  return http.get(DESCRIBE_ASSET_URL, async ({ params }) => {
    const { assetId } = params as { assetId: string };

    const asset = ASSET_HIERARCHY.findAssetById(assetId);

    if (!asset) {
      return HttpResponse.json(null, { status: 404 });
    }

    await delay();
    return HttpResponse.json(asset, { status: 200 });
  });
}
