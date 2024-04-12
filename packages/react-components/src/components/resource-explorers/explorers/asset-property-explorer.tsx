import type { AssetProperty } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { AssetPropertyTable } from '../tables/asset-property-table';
import {
  UseAssetPropertiesOptions,
  useAssetProperties,
} from '../requests/use-asset-properties';
import type { ResourceExplorerProps } from '../types/resource-explorer';
import type { AssetPropertyName } from '../types/resource';
import type {
  ListAssetModelProperties,
  ListAssetProperties,
} from '../types/request-fn';
import { useUserSettings } from '../use-settings';
import { DEFAULT_PAGE_SIZE } from '../../table/constants';
import {
  ASSET_PROPERTY_NAME,
  createDefaultTableUserSettings,
} from '../constants/defaults/misc';
import { DEFAULT_ASSET_PROPERTY_TABLE_PROPERTIES } from '../constants/defaults/table-properties';

export interface AssetPropertyExplorerProps
  extends ResourceExplorerProps<AssetProperty, AssetPropertyName> {
  queries: UseAssetPropertiesOptions['queries'];

  dataSource: {
    listAssetProperties: ListAssetProperties;
    listAssetModelProperties: ListAssetModelProperties;
  };
}

/**
 * Explore and select IoT SiteWise asset property resources.
 *
 * @experimental Do not use in production.
 */
export function AssetPropertyExplorer({
  dataSource,
  queries,
  tableSettings,
  shouldStoreUserSettings,
  defaultPageSize: userCustomDefaultPageSize,
  defaultTableUserSettings: userCustomTableUserSettings,
  ...assetPropertyExplorerProps
}: AssetPropertyExplorerProps) {
  const defaultPageSize = userCustomDefaultPageSize ?? DEFAULT_PAGE_SIZE;
  const defaultTableUserSettings =
    userCustomTableUserSettings ??
    createDefaultTableUserSettings(DEFAULT_ASSET_PROPERTY_TABLE_PROPERTIES);

  const [userSettings, onUserSettingsChange] = useUserSettings<AssetProperty>({
    resourceName: ASSET_PROPERTY_NAME,
    defaultPageSize,
    defaultTableUserSettings,
    shouldStoreUserSettings,
  });

  const { nextPage: onClickNextPage, ...assetPropertiesResult } =
    useAssetProperties({
      queries,
      listAssetProperties: dataSource.listAssetProperties,
      listAssetModelProperties: dataSource.listAssetModelProperties,
      maxResults: userSettings.pageSize,
    });

  return (
    <AssetPropertyTable
      {...assetPropertyExplorerProps}
      {...assetPropertiesResult}
      userSettings={userSettings}
      onUserSettingsChange={onUserSettingsChange}
      onClickNextPage={onClickNextPage}
    />
  );
}
