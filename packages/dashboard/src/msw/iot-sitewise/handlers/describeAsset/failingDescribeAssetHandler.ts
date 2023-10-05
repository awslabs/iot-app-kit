import { rest } from 'msw';

import { DESCRIBE_ASSET_URL } from './constants';

export function failingDescribeAssetHandler() {
  return rest.get(DESCRIBE_ASSET_URL, (_req, res, ctx) => {
    return res(ctx.status(500));
  });
}
