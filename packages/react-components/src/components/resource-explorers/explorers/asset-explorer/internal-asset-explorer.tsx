import Link from '@cloudscape-design/components/link';
import { useState } from 'react';
import {
  DEFAULT_ASSET_RESOURCE_NAME,
  DEFAULT_DEFAULT_PAGE_SIZE,
  DEFAULT_IS_RESOURCE_DISABLED,
  DEFAULT_IS_TABLE_ENABLED,
  DEFAULT_IS_TABLE_FILTER_ENABLED,
  DEFAULT_IS_TABLE_SEARCH_ENABLED,
  DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  DEFAULT_ON_SELECT_RESOURCE,
  DEFAULT_PLURAL_ASSET_RESOURCE_NAME,
  DEFAULT_RESOURCE_EXPLORER_VARIANT,
  DEFAULT_SELECTED_RESOURCES,
  DEFAULT_SELECTION_MODE,
  DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  createDefaultTableUserSettings,
} from '../../constants/defaults';
import { DEFAULT_ASSET_DROP_DOWN_DEFINITION } from '../../constants/drop-down-resource-definitions';
import { createDefaultAssetTableDefinition } from '../../constants/table-resource-definitions';
import { useUserCustomization } from '../../helpers/use-user-customization';
import type { AssetResource } from '../../types/resources';
import {
  ResourceDropDown,
  ResourceExplorerVariant,
  ResourceTable,
} from '../../variants';
import { AssetHierarchyPath } from './asset-hierarchy-path';
import type { AssetExplorerProps } from './types';
import { useAssets } from './use-assets';
import { useParentAsset } from './use-parent-asset';

export function InternalAssetExplorer({
  iotSiteWiseClient,
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
    isTitleEnabled = DEFAULT_IS_TABLE_ENABLED,
    isSearchEnabled = DEFAULT_IS_TABLE_SEARCH_ENABLED,
    isFilterEnabled: isTableFilterEnabled = DEFAULT_IS_TABLE_FILTER_ENABLED,
    isUserSettingsEnabled = DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  } = {},
  dropDownResourceDefinition = DEFAULT_ASSET_DROP_DOWN_DEFINITION,
  dropDownSettings: { isFilterEnabled: isDropDownFilterEnabled = false } = {},
  description = '',
  ariaLabels,
}: AssetExplorerProps) {
  const tableResourceDefinition =
    customTableResourceDefinition ??
    createDefaultAssetTableDefinition((asset) => {
      if ((asset.hierarchies ?? []).length > 0 && parameters === undefined) {
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

  const { assets, isLoadingFirstPage, isLoadingResources, error } = useAssets({
    parameters: isParentAsset(parentAsset)
      ? [parentAsset]
      : isSearched(userSearchStatement)
      ? [{ searchStatement: userSearchStatement }]
      : parameters,
    listAssets: iotSiteWiseClient?.listAssets?.bind(iotSiteWiseClient),
    listAssociatedAssets:
      iotSiteWiseClient?.listAssociatedAssets?.bind(iotSiteWiseClient),
    executeQuery: iotSiteWiseClient?.executeQuery?.bind(iotSiteWiseClient),
    pageSize: 250,
  });

  return (
    <ResourceExplorerVariant
      variant={variant}
      table={
        <ResourceTable
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          resourceDefinition={tableResourceDefinition}
          resources={assets}
          createResourceKey={createResourceKey}
          isResourceDisabled={isAssetDisabled}
          isLoadingFirstPage={isLoadingFirstPage}
          isLoadingResources={isLoadingResources}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAssets}
          onSelectResource={onSelectAsset}
          userCustomization={userCustomization}
          onUpdateUserCustomization={setUserCutomization}
          onClickSearch={onClickSearch}
          isTitleEnabled={isTitleEnabled}
          isSearchEnabled={isSearchEnabled}
          isFilterEnabled={isTableFilterEnabled}
          isUserSettingsEnabled={isUserSettingsEnabled}
          titleExtension={
            iotSiteWiseClient?.listAssociatedAssets &&
            parameters === undefined && (
              <AssetHierarchyPath
                parentAsset={parentAsset}
                listAssociatedAssets={iotSiteWiseClient?.listAssociatedAssets?.bind(
                  iotSiteWiseClient
                )}
                onClickPathAsset={onClickAssetName}
              />
            )
          }
          description={description}
          ariaLabels={ariaLabels}
        />
      }
      dropDown={
        <ResourceDropDown
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          resourceDefinition={dropDownResourceDefinition}
          resources={assets}
          isResourceDisabled={isAssetDisabled}
          isLoadingResources={isLoadingResources}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAssets}
          onSelectResource={onSelectAsset}
          isFilterEnabled={isDropDownFilterEnabled}
        />
      }
    />
  );
}

function createResourceKey({ assetId }: AssetResource): string {
  return assetId;
}
