import { type ListAssetsResponse } from '@aws-sdk/client-iotsitewise';
import { rest } from 'msw';

import { LIST_ASSETS_URL } from './constants';

export function emptyListAssetsHandler() {
  return rest.get(LIST_ASSETS_URL, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        assetSummaries: [],
        nextToken: undefined,
      } satisfies ListAssetsResponse)
    );
  });
}
