import React from 'react';

import { ResourceTable } from '../../resource-table';
import { useUserCustomization } from '../../use-user-customization';
import {
  DEFAULT_ASSET_MODEL_RESOURCE_NAME,
  DEFAULT_DEFAULT_PAGE_SIZE,
  DEFAULT_IS_RESOURCE_DISABLED,
  DEFAULT_IS_TABLE_FILTER_ENABLED,
  DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  DEFAULT_IS_TABLE_TITLELESS,
  DEFAULT_ON_SELECT_RESOURCE,
  DEFAULT_PLURAL_ASSET_MODEL_RESOURCE_NAME,
  DEFAULT_RESOURCE_EXPLORER_VARIANT,
  DEFAULT_SELECTED_RESOURCES,
  DEFAULT_SELECTION_MODE,
  DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  createDefaultTableUserSettings,
} from '../../constants/defaults';
import type { AssetModelResource } from '../../types/resources';
import { DEFAULT_ASSET_MODEL_TABLE_DEFINITION } from '../../constants/table-resource-definitions';
import { DEFAULT_ASSET_MODEL_DROP_DOWN_DEFINITION } from '../../constants/drop-down-resource-definitions';
import { ResourceDropDown } from '../../resource-drop-down';
import { AssetModelExplorerProps } from './types';
import { transformListAssetModelsResponse } from '../../helpers/response-transformers';
import { ResourceExplorerVariant } from '../variant-selector';
import { useMultipleListRequests } from '../../requests/use-multiple-list-requests';
import { DEFAULT_ASSET_MODEL_ARIA_LABELS } from '../../constants/aria-labels';

export function InternalAssetModelExplorer({
  requestFns,
  parameters = [{}],
  shouldPersistUserCustomization = DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  defaultPageSize = DEFAULT_DEFAULT_PAGE_SIZE,
  variant = DEFAULT_RESOURCE_EXPLORER_VARIANT,
  resourceName = DEFAULT_ASSET_MODEL_RESOURCE_NAME,
  pluralResourceName = DEFAULT_PLURAL_ASSET_MODEL_RESOURCE_NAME,
  isAssetModelDisabled = DEFAULT_IS_RESOURCE_DISABLED,
  selectedAssetModels = DEFAULT_SELECTED_RESOURCES,
  onSelectAssetModel = DEFAULT_ON_SELECT_RESOURCE,
  selectionMode = DEFAULT_SELECTION_MODE,
  tableResourceDefinition = DEFAULT_ASSET_MODEL_TABLE_DEFINITION,
  defaultTableUserSettings = createDefaultTableUserSettings(
    tableResourceDefinition
  ),
  tableSettings: {
    isTitleless = DEFAULT_IS_TABLE_TITLELESS,
    isFilterEnabled: isTableFilterEnabled = DEFAULT_IS_TABLE_FILTER_ENABLED,
    isUserSettingsEnabled = DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  } = {},
  dropDownResourceDefinition = DEFAULT_ASSET_MODEL_DROP_DOWN_DEFINITION,
  dropDownSettings: { isFilterEnabled: isDropDownFilterEnabled = false } = {},
}: AssetModelExplorerProps) {
  const [userCustomization, setUserCutomization] = useUserCustomization({
    resourceName,
    defaultPageSize,
    defaultTableUserSettings,
    shouldPersistUserCustomization,
  });

  const {
    resources: assetModels,
    isLoading,
    error,
    nextPage,
    hasNextPage,
  } = useMultipleListRequests({
    pageSize: userCustomization.pageSize,
    resourceId: 'AssetModelSummary',
    parameters: parameters ?? [],
    requestFn: requestFns?.listAssetModels?.bind(requestFns),
    responseTransformer: transformListAssetModelsResponse,
  });

  return (
    <ResourceExplorerVariant
      variant={variant}
      table={
        <ResourceTable<AssetModelResource>
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          ariaLabels={DEFAULT_ASSET_MODEL_ARIA_LABELS.tableAriaLabels}
          resourceDefinition={tableResourceDefinition}
          resources={assetModels}
          createResourceKey={createResourceKey}
          isResourceDisabled={isAssetModelDisabled}
          isLoading={isLoading}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAssetModels}
          onSelectResource={onSelectAssetModel}
          hasNextPage={hasNextPage}
          onClickNextPage={nextPage}
          userCustomization={userCustomization}
          onUpdateUserCustomization={setUserCutomization}
          isTitleless={isTitleless}
          isFilterEnabled={isTableFilterEnabled}
          isUserSettingsEnabled={isUserSettingsEnabled}
        />
      }
      dropDown={
        <ResourceDropDown<AssetModelResource>
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          resourceDefinition={dropDownResourceDefinition}
          resources={assetModels}
          isResourceDisabled={isAssetModelDisabled}
          isLoading={isLoading}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAssetModels}
          onSelectResource={onSelectAssetModel}
          hasNextPage={hasNextPage}
          onScrollNextPage={nextPage}
          isFilterEnabled={isDropDownFilterEnabled}
        />
      }
    />
  );
}

function createResourceKey({ assetModelId }: AssetModelResource): string {
  return assetModelId;
}
