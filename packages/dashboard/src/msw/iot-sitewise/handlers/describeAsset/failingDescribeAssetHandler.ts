import { http, HttpResponse } from 'msw';
import { DESCRIBE_ASSET_URL } from './constants';

export function failingDescribeAssetHandler() {
  return http.get(DESCRIBE_ASSET_URL, () => {
    return HttpResponse.json(null, { status: 500 });
  });
}
