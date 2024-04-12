import type { AssetModelSummary } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { useAssetModels } from '../requests/use-asset-models';
import type { ResourceExplorerProps } from '../types/resource-explorer';
import { AssetModelTable } from '../tables/asset-model-table';
import type { AssetModelName } from '../types/resource';
import type { ListAssetModels } from '../types/request-fn';

import { useUserSettings } from '../use-settings';
import { DEFAULT_PAGE_SIZE } from '../../table/constants';
import {
  ASSET_MODEL_NAME,
  createDefaultTableUserSettings,
} from '../constants/defaults/misc';
import { DEFAULT_ASSET_MODEL_TABLE_PROPERTIES } from '../constants/defaults/table-properties';

export interface AssetModelExplorerProps
  extends ResourceExplorerProps<AssetModelSummary, AssetModelName> {
  assetModelTypes?: Parameters<ListAssetModels>[0]['assetModelTypes'];

  dataSource: {
    listAssetModels: ListAssetModels;
  };
}

/**
 * Explore and select IoT SiteWise asset model summary resources.
 *
 * @experimental Do not use in production.
 */
export function AssetModelExplorer({
  dataSource: { listAssetModels },
  assetModelTypes,
  shouldStoreUserSettings,
  defaultPageSize: userCustomDefaultPageSize,
  defaultTableUserSettings: userCustomTableUserSettings,
  ...assetModelExplorerProps
}: AssetModelExplorerProps) {
  const defaultPageSize = userCustomDefaultPageSize ?? DEFAULT_PAGE_SIZE;
  const defaultTableUserSettings =
    userCustomTableUserSettings ??
    createDefaultTableUserSettings(DEFAULT_ASSET_MODEL_TABLE_PROPERTIES);

  const [userSettings, onUserSettingsChange] =
    useUserSettings<AssetModelSummary>({
      resourceName: ASSET_MODEL_NAME,
      defaultPageSize,
      defaultTableUserSettings,
      shouldStoreUserSettings,
    });

  const { nextPage: onClickNextPage, ...assetModelsResult } = useAssetModels({
    params: { assetModelTypes },
    listAssetModels,
    maxResults: userSettings.pageSize,
  });

  return (
    <AssetModelTable
      {...assetModelExplorerProps}
      {...assetModelsResult}
      userSettings={userSettings}
      onUserSettingsChange={onUserSettingsChange}
      onClickNextPage={onClickNextPage}
    />
  );
}
