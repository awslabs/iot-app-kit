import Link from '@cloudscape-design/components/link';
import React, { useState } from 'react';

import {
  DEFAULT_ASSET_RESOURCE_NAME,
  DEFAULT_DEFAULT_PAGE_SIZE,
  DEFAULT_IS_RESOURCE_DISABLED,
  DEFAULT_IS_TABLE_FILTER_ENABLED,
  DEFAULT_IS_TABLE_SEARCH_ENABLED,
  DEFAULT_IS_TABLE_TITLELESS,
  DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  DEFAULT_ON_SELECT_RESOURCE,
  DEFAULT_PLURAL_ASSET_RESOURCE_NAME,
  DEFAULT_RESOURCE_EXPLORER_VARIANT,
  DEFAULT_SELECTED_RESOURCES,
  DEFAULT_SELECTION_MODE,
  DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  createDefaultTableUserSettings,
} from '../../constants/defaults';
import type { AssetResource } from '../../types/resources';
import { ResourceTable } from '../../resource-table';
import { ResourceDropDown } from '../../resource-drop-down';
import { createDefaultAssetTableDefinition } from '../../constants/table-resource-definitions';
import { DEFAULT_ASSET_DROP_DOWN_DEFINITION } from '../../constants/drop-down-resource-definitions';
import { useUserCustomization } from '../../use-user-customization';
import { AssetHierarchyPath } from './asset-hierarchy-path';
import type { AssetExplorerProps } from './types';
import { useParentAsset } from './use-parent-asset';
import { ResourceExplorerVariant } from '../variant-selector';
import { useAssets } from '../../requests';
import { DEFAULT_ASSET_ARIA_LABELS } from '../../constants/aria-labels';

export function InternalAssetExplorer({
  requestFns,
  parameters,
  shouldPersistUserCustomization = DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  defaultPageSize = DEFAULT_DEFAULT_PAGE_SIZE,
  variant = DEFAULT_RESOURCE_EXPLORER_VARIANT,
  resourceName = DEFAULT_ASSET_RESOURCE_NAME,
  pluralResourceName = DEFAULT_PLURAL_ASSET_RESOURCE_NAME,
  isAssetDisabled = DEFAULT_IS_RESOURCE_DISABLED,
  selectedAssets = DEFAULT_SELECTED_RESOURCES,
  onSelectAsset = DEFAULT_ON_SELECT_RESOURCE,
  selectionMode = DEFAULT_SELECTION_MODE,
  tableResourceDefinition: customTableResourceDefinition,
  defaultTableUserSettings: customDefaultTableUserSettings,
  tableSettings: {
    isTitleless = DEFAULT_IS_TABLE_TITLELESS,
    isSearchEnabled = DEFAULT_IS_TABLE_SEARCH_ENABLED,
    isFilterEnabled: isTableFilterEnabled = DEFAULT_IS_TABLE_FILTER_ENABLED,
    isUserSettingsEnabled = DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  } = {},
  dropDownResourceDefinition = DEFAULT_ASSET_DROP_DOWN_DEFINITION,
  dropDownSettings: { isFilterEnabled: isDropDownFilterEnabled = false } = {},
}: AssetExplorerProps) {
  /*
  if (isSearchEnabled && !requestFns?.executeQuery) {
    assertSearchConfiguration();
  }
  */

  const tableResourceDefinition =
    customTableResourceDefinition ??
    createDefaultAssetTableDefinition((asset) => {
      if ((asset.hierarchies ?? []).length > 0) {
        return (
          <Link onFollow={() => onClickAssetName(asset)}>{asset.name}</Link>
        );
      } else {
        return asset.name;
      }
    });
  const defaultTableUserSettings =
    customDefaultTableUserSettings ??
    createDefaultTableUserSettings(tableResourceDefinition);

  const [parentAsset, setParentAsset] = useParentAsset();

  function onClickAssetName(asset?: AssetResource): void {
    setParentAsset(asset);
  }

  const [userCustomization, setUserCutomization] = useUserCustomization({
    resourceName,
    defaultPageSize,
    defaultTableUserSettings,
    shouldPersistUserCustomization,
  });

  const [userSearchStatement, setUserSearchStatement] = useState('');

  function onClickSearch(searchStatement: string) {
    setParentAsset(undefined);
    setUserSearchStatement(searchStatement);
  }

  function isSearched(searchStatement?: string): searchStatement is string {
    return Boolean(searchStatement);
  }

  function isParentAsset(asset?: AssetResource): asset is AssetResource {
    return asset !== undefined;
  }

  const { assets, isLoading, error, hasNextPage, nextPage } = useAssets({
    parameters: isParentAsset(parentAsset)
      ? [parentAsset]
      : isSearched(userSearchStatement)
      ? [{ searchStatement: userSearchStatement }]
      : parameters,
    listAssets: requestFns?.listAssets?.bind(requestFns),
    listAssociatedAssets: requestFns?.listAssociatedAssets?.bind(requestFns),
    executeQuery: requestFns?.executeQuery?.bind(requestFns),
    pageSize: userCustomization.pageSize,
  });

  // TODO: Handle hiding breadcrumbs - use shared predicates

  return (
    <ResourceExplorerVariant
      variant={variant}
      table={
        <ResourceTable<AssetResource>
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          ariaLabels={DEFAULT_ASSET_ARIA_LABELS.tableAriaLabels}
          resourceDefinition={tableResourceDefinition}
          resources={assets as AssetResource[]}
          createResourceKey={createResourceKey}
          isResourceDisabled={isAssetDisabled}
          isLoading={isLoading}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAssets}
          onSelectResource={onSelectAsset}
          hasNextPage={hasNextPage}
          onClickNextPage={nextPage}
          userCustomization={userCustomization}
          onUpdateUserCustomization={setUserCutomization}
          onClickSearch={onClickSearch}
          isTitleless={isTitleless}
          isSearchEnabled={isSearchEnabled}
          isFilterEnabled={isTableFilterEnabled}
          isUserSettingsEnabled={isUserSettingsEnabled}
          titleExtension={
            requestFns?.listAssociatedAssets && (
              <AssetHierarchyPath
                parentAsset={parentAsset}
                listAssociatedAssets={requestFns?.listAssociatedAssets?.bind(
                  requestFns
                )}
                onClickPathAsset={onClickAssetName}
              />
            )
          }
        />
      }
      dropDown={
        <ResourceDropDown<AssetResource>
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          resourceDefinition={dropDownResourceDefinition}
          resources={assets}
          isResourceDisabled={isAssetDisabled}
          isLoading={isLoading}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAssets}
          onSelectResource={onSelectAsset}
          hasNextPage={hasNextPage}
          onScrollNextPage={nextPage}
          isFilterEnabled={isDropDownFilterEnabled}
        />
      }
    />
  );
}

function createResourceKey({ assetId }: AssetResource): string {
  return assetId;
}
