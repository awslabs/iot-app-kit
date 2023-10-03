import { rest } from 'msw';

import { LIST_ASSETS_URL } from './constants';

export function emptyListAssetsHandler() {
  return rest.get(LIST_ASSETS_URL, (_req, res, ctx) => {
    return res(ctx.status(500));
  });
}
