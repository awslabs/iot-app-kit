import { type ListAssetsResponse } from '@aws-sdk/client-iotsitewise';
import { rest } from 'msw';
import { v4 as uuid } from 'uuid';

import { LIST_ASSETS_URL } from './constants';
import {
  AFRICA_SITE_ASSET_SUMMARY,
  ANTARCTICA_SITE_ASSET_SUMMARY,
  ASIA_SITE_ASSET_SUMMARY,
  AUSTRALIA_SITE_ASSET_SUMMARY,
  EUROPE_SITE_ASSET_SUMMARY,
  NORTH_AMERICA_SITE_ASSET_SUMMARY,
  SOUTH_AMERICA_SITE_ASSET_SUMMARY,
} from '../constants';

export function paginatedListAssetsHandler() {
  let requestCount = 0;

  return rest.get(LIST_ASSETS_URL, (_req, res, ctx) => {
    requestCount += 1;

    if (requestCount === 1) {
      return res(
        ctx.status(200),
        ctx.json({
          assetSummaries: [AFRICA_SITE_ASSET_SUMMARY, ANTARCTICA_SITE_ASSET_SUMMARY, ASIA_SITE_ASSET_SUMMARY],
          nextToken: uuid(),
        } satisfies ListAssetsResponse)
      );
    }

    if (requestCount === 2) {
      return res(
        ctx.status(200),
        ctx.json({
          assetSummaries: [AUSTRALIA_SITE_ASSET_SUMMARY, EUROPE_SITE_ASSET_SUMMARY, NORTH_AMERICA_SITE_ASSET_SUMMARY],
          nextToken: uuid(),
        } satisfies ListAssetsResponse)
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        assetSummaries: [SOUTH_AMERICA_SITE_ASSET_SUMMARY],
        nextToken: undefined,
      } satisfies ListAssetsResponse)
    );
  });
}
