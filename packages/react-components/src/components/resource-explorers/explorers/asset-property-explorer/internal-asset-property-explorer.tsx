import { useState } from 'react';
import {
  DEFAULT_ASSET_PROPERTY_RESOURCE_NAME,
  DEFAULT_DEFAULT_PAGE_SIZE,
  DEFAULT_IS_RESOURCE_DISABLED,
  DEFAULT_IS_TABLE_ENABLED,
  DEFAULT_IS_TABLE_FILTER_ENABLED,
  DEFAULT_IS_TABLE_SEARCH_ENABLED,
  DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  DEFAULT_ON_SELECT_RESOURCE,
  DEFAULT_PLURAL_ASSET_PROPERTY_RESOURCE_NAME,
  DEFAULT_RESOURCE_EXPLORER_VARIANT,
  DEFAULT_SELECTED_RESOURCES,
  DEFAULT_SELECTION_MODE,
  DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  createDefaultTableUserSettings,
  latestValueCellRenderer,
  latestValueTimeCellRenderer,
} from '../../constants/defaults';
import { DEFAULT_ASSET_PROPERTY_DROP_DOWN_DEFINITION } from '../../constants/drop-down-resource-definitions';
import {
  DEFAULT_ASSET_PROPERTY_TABLE_DEFINITION,
  createDefaultLatestValuesTableDefinition,
} from '../../constants/table-resource-definitions';
import { useUserCustomization } from '../../helpers/use-user-customization';
import type { AssetPropertyResource } from '../../types/resources';
import type { TableResourceDefinition } from '../../types/table';
import {
  ResourceDropDown,
  ResourceExplorerVariant,
  ResourceTable,
} from '../../variants';
import type { AssetPropertyExplorerProps } from './types';
import { useAssetProperties } from './use-asset-properties';

export function InternalAssetPropertyExplorer({
  iotSiteWiseClient,
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
  tableResourceDefinition: customTableResourceDefinition,
  defaultTableUserSettings: customDefaultTableUserSettings,
  tableSettings: {
    isTitleEnabled = DEFAULT_IS_TABLE_ENABLED,
    isSearchEnabled = DEFAULT_IS_TABLE_SEARCH_ENABLED,
    isFilterEnabled: isTableFilterEnabled = DEFAULT_IS_TABLE_FILTER_ENABLED,
    isUserSettingsEnabled = DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  } = {},
  dropDownResourceDefinition = DEFAULT_ASSET_PROPERTY_DROP_DOWN_DEFINITION,
  dropDownSettings: { isFilterEnabled: isDropDownFilterEnabled = false } = {},
  ariaLabels,
  description = '',
  timeZone,
  significantDigits,
}: AssetPropertyExplorerProps) {
  const tableResourceDefinition =
    customTableResourceDefinition ??
    iotSiteWiseClient?.batchGetAssetPropertyValue !== undefined
      ? ([
          ...DEFAULT_ASSET_PROPERTY_TABLE_DEFINITION,
          ...createDefaultLatestValuesTableDefinition(
            latestValueTimeCellRenderer(timeZone),
            latestValueCellRenderer(significantDigits)
          ),
        ] as TableResourceDefinition<AssetPropertyResource>)
      : DEFAULT_ASSET_PROPERTY_TABLE_DEFINITION;

  const defaultTableUserSettings =
    customDefaultTableUserSettings ??
    createDefaultTableUserSettings(tableResourceDefinition);
  const [userCustomization, setUserCutomization] = useUserCustomization({
    resourceName,
    defaultPageSize,
    defaultTableUserSettings,
    shouldPersistUserCustomization,
  });

  const [userSearchStatement, setUserSearchStatement] = useState('');

  function onClickSearch(searchStatement: string) {
    setUserSearchStatement(searchStatement);
  }

  function isSearched(searchStatement: string) {
    return Boolean(searchStatement);
  }

  const { assetProperties, isLoadingFirstPage, isLoadingResources, error } =
    useAssetProperties({
      parameters: isSearched(userSearchStatement)
        ? [{ searchStatement: userSearchStatement }]
        : parameters,
      batchGetAssetPropertyValue:
        iotSiteWiseClient?.batchGetAssetPropertyValue?.bind(iotSiteWiseClient),
      executeQuery: iotSiteWiseClient?.executeQuery?.bind(iotSiteWiseClient),
      listAssetProperties:
        iotSiteWiseClient?.listAssetProperties?.bind(iotSiteWiseClient),
      listAssetModelProperties:
        iotSiteWiseClient?.listAssetModelProperties?.bind(iotSiteWiseClient),
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
          resources={assetProperties}
          createResourceKey={createResourceKey}
          isResourceDisabled={isAssetPropertyDisabled}
          isLoadingFirstPage={isLoadingFirstPage}
          isLoadingResources={isLoadingResources}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAssetProperties}
          onSelectResource={onSelectAssetProperty}
          userCustomization={userCustomization}
          onUpdateUserCustomization={setUserCutomization}
          onClickSearch={onClickSearch}
          isTitleEnabled={isTitleEnabled}
          isSearchEnabled={isSearchEnabled}
          isFilterEnabled={isTableFilterEnabled}
          isUserSettingsEnabled={isUserSettingsEnabled}
          ariaLabels={ariaLabels}
          description={description}
        />
      }
      dropDown={
        <ResourceDropDown
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          resourceDefinition={dropDownResourceDefinition}
          resources={assetProperties}
          isResourceDisabled={isAssetPropertyDisabled}
          isLoadingResources={isLoadingResources}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAssetProperties}
          onSelectResource={onSelectAssetProperty}
          isFilterEnabled={isDropDownFilterEnabled}
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
