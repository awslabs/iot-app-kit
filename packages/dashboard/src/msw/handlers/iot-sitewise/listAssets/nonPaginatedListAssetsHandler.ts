import { type ListAssetsResponse } from '@aws-sdk/client-iotsitewise';
import { rest } from 'msw';

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

export function nonPaginatedListAssetsHandler() {
  return rest.get(LIST_ASSETS_URL, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        assetSummaries: [
          AFRICA_SITE_ASSET_SUMMARY,
          ANTARCTICA_SITE_ASSET_SUMMARY,
          ASIA_SITE_ASSET_SUMMARY,
          AUSTRALIA_SITE_ASSET_SUMMARY,
          EUROPE_SITE_ASSET_SUMMARY,
          NORTH_AMERICA_SITE_ASSET_SUMMARY,
          SOUTH_AMERICA_SITE_ASSET_SUMMARY,
        ],
        nextToken: undefined,
      } satisfies ListAssetsResponse)
    );
  });
}
