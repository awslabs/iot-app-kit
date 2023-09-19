import { rest } from 'msw';

import { LIST_ASSOCIATED_ASSETS_URL } from './constants';
import { ListAssociatedAssetsResponse, type ListAssociatedAssetsRequest } from '@aws-sdk/client-iotsitewise';
import {
  AFRICA_PRODUCTION_LINE_1_ASSET_ID,
  AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_REACTOR_1_ASSET_ID,
  AFRICA_PRODUCTION_LINE_1_REACTOR_1_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_REACTOR_2_ASSET_ID,
  AFRICA_PRODUCTION_LINE_1_REACTOR_2_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_REACTOR_3_ASSET_ID,
  AFRICA_PRODUCTION_LINE_1_REACTOR_3_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_REACTOR_4_ASSET_ID,
  AFRICA_PRODUCTION_LINE_1_REACTOR_4_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_REACTOR_5_ASSET_ID,
  AFRICA_PRODUCTION_LINE_1_REACTOR_5_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_1_ASSET_ID,
  AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_1_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_2_ASSET_ID,
  AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_2_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_3_ASSET_ID,
  AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_3_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_2_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_3_ASSET_SUMMARY,
  AFRICA_PRODUCTION_LINE_4_ASSET_SUMMARY,
  AFRICA_SITE_ASSET_ID,
  AFRICA_SITE_ASSET_SUMMARY,
  PRODUCTION_LINE_HIERARCHY,
  REACTOR_HIERARCHY,
  STORAGE_TANK_HIERARCHY,
} from '../constants';

export function listAssociatedAssetsHandler() {
  return rest.get<ListAssociatedAssetsRequest>(LIST_ASSOCIATED_ASSETS_URL, (req, res, ctx) => {
    const { assetId } = req.params;
    const hierarchyId = req.url.searchParams.get('hierarchyId');
    const traversalDirection = req.url.searchParams.get('traversalDirection');

    let assetSummaries: NonNullable<ListAssociatedAssetsResponse['assetSummaries']> = [];

    if (traversalDirection === 'CHILD') {
      if (assetId === AFRICA_SITE_ASSET_ID) {
        if (hierarchyId === PRODUCTION_LINE_HIERARCHY.id) {
          assetSummaries = [
            AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY,
            AFRICA_PRODUCTION_LINE_2_ASSET_SUMMARY,
            AFRICA_PRODUCTION_LINE_3_ASSET_SUMMARY,
            AFRICA_PRODUCTION_LINE_4_ASSET_SUMMARY,
          ];
        }
      }

      if (assetId === AFRICA_PRODUCTION_LINE_1_ASSET_ID) {
        if (hierarchyId === REACTOR_HIERARCHY.id) {
          assetSummaries = [
            AFRICA_PRODUCTION_LINE_1_REACTOR_1_ASSET_SUMMARY,
            AFRICA_PRODUCTION_LINE_1_REACTOR_2_ASSET_SUMMARY,
            AFRICA_PRODUCTION_LINE_1_REACTOR_3_ASSET_SUMMARY,
            AFRICA_PRODUCTION_LINE_1_REACTOR_4_ASSET_SUMMARY,
            AFRICA_PRODUCTION_LINE_1_REACTOR_5_ASSET_SUMMARY,
          ];
        }

        if (hierarchyId === STORAGE_TANK_HIERARCHY.id) {
          assetSummaries = [
            AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_1_ASSET_SUMMARY,
            AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_2_ASSET_SUMMARY,
            AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_3_ASSET_SUMMARY,
          ];
        }
      }
    }

    if (traversalDirection === 'PARENT') {
      if (assetId === AFRICA_PRODUCTION_LINE_1_ASSET_ID) {
        assetSummaries = [AFRICA_SITE_ASSET_SUMMARY];
      }

      if (assetId === AFRICA_PRODUCTION_LINE_1_REACTOR_1_ASSET_ID) {
        assetSummaries = [AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY];
      }

      if (assetId === AFRICA_PRODUCTION_LINE_1_REACTOR_2_ASSET_ID) {
        assetSummaries = [AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY];
      }

      if (assetId === AFRICA_PRODUCTION_LINE_1_REACTOR_3_ASSET_ID) {
        assetSummaries = [AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY];
      }

      if (assetId === AFRICA_PRODUCTION_LINE_1_REACTOR_4_ASSET_ID) {
        assetSummaries = [AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY];
      }

      if (assetId === AFRICA_PRODUCTION_LINE_1_REACTOR_5_ASSET_ID) {
        assetSummaries = [AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY];
      }

      if (assetId === AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_1_ASSET_ID) {
        assetSummaries = [AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY];
      }

      if (assetId === AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_2_ASSET_ID) {
        assetSummaries = [AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY];
      }

      if (assetId === AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_3_ASSET_ID) {
        assetSummaries = [AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY];
      }
    }

    console.table({ assetSummaries });

    return res(
      ctx.status(200),
      ctx.json({
        assetSummaries,
        nextToken: undefined,
      } satisfies ListAssociatedAssetsResponse)
    );
  });
}
