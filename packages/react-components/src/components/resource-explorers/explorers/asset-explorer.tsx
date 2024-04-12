import type { AssetSummary } from '@aws-sdk/client-iotsitewise';
import React, { useState } from 'react';

import { DEFAULT_PAGE_SIZE } from '../../table/constants';
import { useAssets } from '../requests/use-assets';
import type { ListAssets, ListAssociatedAssets } from '../types/request-fn';
import type { ResourceExplorerProps } from '../types/resource-explorer';
import { AssetTable } from '../tables/asset-table';
import type { AssetName } from '../types/resource';
import {
  ASSET_NAME,
  createDefaultTableUserSettings,
} from '../constants/defaults/misc';
import { createDefaultAssetTableProperties } from '../constants/defaults/table-properties';
import { useUserSettings } from '../use-settings';

export interface AssetExplorerProps
  extends ResourceExplorerProps<AssetSummary, AssetName> {
  /** Optionally list assets by asset models. */
  assetModelIds?: string[];

  /** Specify methods for calling AWS APIs. */
  dataSource: {
    listAssets: ListAssets;
    listAssociatedAssets: ListAssociatedAssets;
  };
}

/**
 * Explore and select IoT SiteWise asset summary resources.
 *
 * @experimental Do not use in production.
 */
export function AssetExplorer({
  dataSource,
  assetModelIds = [],
  shouldStoreUserSettings,
  defaultPageSize: userCustomDefaultPageSize,
  defaultTableUserSettings: userCustomTableUserSettings,
  ...assetExplorerProps
}: AssetExplorerProps) {
  // Store the current parent asset ID to list their child assets.
  const [parentAssetId, setParentAssetId] = useState<string | undefined>(
    undefined
  );
  const defaultPageSize = userCustomDefaultPageSize ?? DEFAULT_PAGE_SIZE;
  const defaultTableUserSettings =
    userCustomTableUserSettings ??
    createDefaultTableUserSettings(
      createDefaultAssetTableProperties(() => null)
    );

  const [userSettings, onUserSettingsChange] = useUserSettings<AssetSummary>({
    resourceName: ASSET_NAME,
    defaultPageSize,
    defaultTableUserSettings,
    shouldStoreUserSettings,
  });

  const { nextPage: onClickNextPage, ...assetsResult } = useAssets({
    assetId: parentAssetId,
    assetModelIds,
    listAssets: dataSource.listAssets,
    listAssociatedAssets: dataSource.listAssociatedAssets,
    maxResults: userSettings.pageSize,
  });

  const isExploringAssetModelAssets = assetModelIds.length > 0;

  return (
    <AssetTable
      {...assetExplorerProps}
      {...assetsResult}
      userSettings={userSettings}
      onUserSettingsChange={onUserSettingsChange}
      onClickNextPage={onClickNextPage}
      onAssetNameClick={setParentAssetId}
      isExploringAssetModelAssets={isExploringAssetModelAssets}
    />
  );
}
