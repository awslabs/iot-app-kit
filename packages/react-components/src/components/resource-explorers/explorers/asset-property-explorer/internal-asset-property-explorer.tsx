import React, { useState } from 'react';

import { useAssetProperties } from '../../requests/use-asset-properties';

import {
  DEFAULT_ASSET_PROPERTY_RESOURCE_NAME,
  DEFAULT_DEFAULT_PAGE_SIZE,
  DEFAULT_IS_RESOURCE_DISABLED,
  DEFAULT_IS_TABLE_FILTER_ENABLED,
  DEFAULT_IS_TABLE_SEARCH_ENABLED,
  DEFAULT_IS_TABLE_TITLELESS,
  DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  DEFAULT_ON_SELECT_RESOURCE,
  DEFAULT_PLURAL_ASSET_PROPERTY_RESOURCE_NAME,
  DEFAULT_RESOURCE_EXPLORER_VARIANT,
  DEFAULT_SELECTED_RESOURCES,
  DEFAULT_SELECTION_MODE,
  DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  createDefaultTableUserSettings,
} from '../../constants/defaults';
import { AssetPropertyResource } from '../../types/resources';
import { DEFAULT_ASSET_PROPERTY_TABLE_DEFINITION } from '../../constants/table-resource-definitions';
import { DEFAULT_ASSET_PROPERTY_DROP_DOWN_DEFINITION } from '../../constants/drop-down-resource-definitions';
import { ResourceTable } from '../../resource-table';
import { ResourceDropDown } from '../../resource-drop-down';
import { useUserCustomization } from '../../use-user-customization';
import { assertSearchConfiguration } from '../../helpers/errors';
import type { AssetPropertyExplorerProps } from './types';
import { ResourceExplorerVariant } from '../variant-selector';
import { DEFAULT_ASSET_PROPERTY_ARIA_LABELS } from '../../constants/aria-labels';

export function InternalAssetPropertyExplorer({
  requestFns,
  parameters = [],
  shouldPersistUserCustomization = DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  defaultPageSize = DEFAULT_DEFAULT_PAGE_SIZE,
  variant = DEFAULT_RESOURCE_EXPLORER_VARIANT,
  resourceName = DEFAULT_ASSET_PROPERTY_RESOURCE_NAME,
  pluralResourceName = DEFAULT_PLURAL_ASSET_PROPERTY_RESOURCE_NAME,
  isAssetPropertyDisabled = DEFAULT_IS_RESOURCE_DISABLED,
  selectedAssetProperties = DEFAULT_SELECTED_RESOURCES,
  onSelectAssetProperty = DEFAULT_ON_SELECT_RESOURCE,
  selectionMode = DEFAULT_SELECTION_MODE,
  tableResourceDefinition = DEFAULT_ASSET_PROPERTY_TABLE_DEFINITION,
  defaultTableUserSettings = createDefaultTableUserSettings(
    tableResourceDefinition
  ),
  tableSettings: {
    isTitleless = DEFAULT_IS_TABLE_TITLELESS,
    isSearchEnabled = DEFAULT_IS_TABLE_SEARCH_ENABLED,
    isFilterEnabled = DEFAULT_IS_TABLE_FILTER_ENABLED,
    isUserSettingsEnabled = DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  } = {},
  dropDownResourceDefinition = DEFAULT_ASSET_PROPERTY_DROP_DOWN_DEFINITION,
}: AssetPropertyExplorerProps) {
  if (isSearchEnabled && !requestFns?.executeQuery) {
    assertSearchConfiguration();
  }

  const [userCustomization, setUserCutomization] = useUserCustomization({
    resourceName,
    defaultPageSize,
    defaultTableUserSettings,
    shouldPersistUserCustomization,
  });

  const [_userSearchStatement, setUserSearchStatement] = useState('');

  const { assetProperties, isLoading, error, hasNextPage, nextPage } =
    useAssetProperties({
      parameters,
      // @ts-expect-error TODO
      listAssetProperties: requestFns?.listAssetProperties?.bind(requestFns),
      // @ts-expect-error TODO
      listAssetModelProperties:
        requestFns?.listAssetModelProperties?.bind(requestFns),
      pageSize: userCustomization.pageSize,
    });

  /*
  const { responseEntries } = useLatestValues({
    requestEntries: assetPropertiesResult.assetProperties.map(
      (assetProperty) => ({
        entryId: '',
        assetId: '',
        propertyId: assetProperty.id,
        propertyAlias: assetProperty.alias,
      })
    ),
    batchGetAssetPropertyValue,
  });
  */

  return (
    <ResourceExplorerVariant
      variant={variant}
      table={
        <ResourceTable<AssetPropertyResource>
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          ariaLabels={DEFAULT_ASSET_PROPERTY_ARIA_LABELS.tableAriaLabels}
          resourceDefinition={tableResourceDefinition}
          resources={assetProperties}
          createResourceKey={createResourceKey}
          isResourceDisabled={isAssetPropertyDisabled}
          isLoading={isLoading}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAssetProperties}
          onSelectResource={onSelectAssetProperty}
          hasNextPage={hasNextPage}
          onClickNextPage={nextPage}
          userCustomization={userCustomization}
          onUpdateUserCustomization={setUserCutomization}
          onClickSearch={setUserSearchStatement}
          isTitleless={isTitleless}
          isSearchEnabled={isSearchEnabled}
          isFilterEnabled={isFilterEnabled}
          isUserSettingsEnabled={isUserSettingsEnabled}
        />
      }
      dropDown={
        <ResourceDropDown<AssetPropertyResource>
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          resourceDefinition={dropDownResourceDefinition}
          resources={assetProperties}
          isResourceDisabled={isAssetPropertyDisabled}
          isLoading={isLoading}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAssetProperties}
          onSelectResource={onSelectAssetProperty}
          hasNextPage={hasNextPage}
          onScrollNextPage={nextPage}
        />
      }
    />
  );
}

function createResourceKey({
  assetId,
  propertyId,
}: AssetPropertyResource): string {
  return `${assetId}-${propertyId}`;
}
