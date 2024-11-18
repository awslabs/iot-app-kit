import {
  DEFAULT_ASSET_MODEL_RESOURCE_NAME,
  DEFAULT_DEFAULT_PAGE_SIZE,
  DEFAULT_IS_RESOURCE_DISABLED,
  DEFAULT_IS_TABLE_ENABLED,
  DEFAULT_IS_TABLE_FILTER_ENABLED,
  DEFAULT_IS_TABLE_USER_SETTINGS_ENABLED,
  DEFAULT_ON_SELECT_RESOURCE,
  DEFAULT_PLURAL_ASSET_MODEL_RESOURCE_NAME,
  DEFAULT_RESOURCE_EXPLORER_VARIANT,
  DEFAULT_SELECTED_RESOURCES,
  DEFAULT_SELECTION_MODE,
  DEFAULT_SHOULD_PERSIST_USER_CUSTOMIZATION,
  createDefaultTableUserSettings,
} from '../../constants/defaults';
import { DEFAULT_ASSET_MODEL_DROP_DOWN_DEFINITION } from '../../constants/drop-down-resource-definitions';
import { DEFAULT_ASSET_MODEL_TABLE_DEFINITION } from '../../constants/table-resource-definitions';
import { useUserCustomization } from '../../helpers/use-user-customization';
import type { AssetModelResource } from '../../types/resources';
import {
  ResourceDropDown,
  ResourceExplorerVariant,
  ResourceTable,
} from '../../variants';
import type { AssetModelExplorerProps } from './types';
import { useAssetModels } from './use-asset-models';

export function InternalAssetModelExplorer({
  iotSiteWiseClient,
  parameters = [{ assetModelTypes: ['ASSET_MODEL'] }],
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
    isTitleEnabled = DEFAULT_IS_TABLE_ENABLED,
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

  const { assetModels, isLoadingFirstPage, isLoadingResources, error } =
    useAssetModels({
      parameters: parameters,
      pageSize: 250,
      listAssetModels:
        iotSiteWiseClient?.listAssetModels?.bind(iotSiteWiseClient),
    });

  return (
    <ResourceExplorerVariant
      variant={variant}
      table={
        <ResourceTable
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          resourceDefinition={tableResourceDefinition}
          resources={assetModels}
          createResourceKey={createResourceKey}
          isResourceDisabled={isAssetModelDisabled}
          isLoadingFirstPage={isLoadingFirstPage}
          isLoadingResources={isLoadingResources}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAssetModels}
          onSelectResource={onSelectAssetModel}
          userCustomization={userCustomization}
          onUpdateUserCustomization={setUserCutomization}
          isTitleEnabled={isTitleEnabled}
          isFilterEnabled={isTableFilterEnabled}
          isUserSettingsEnabled={isUserSettingsEnabled}
        />
      }
      dropDown={
        <ResourceDropDown
          resourceName={resourceName}
          pluralResourceName={pluralResourceName}
          resourceDefinition={dropDownResourceDefinition}
          resources={assetModels}
          isResourceDisabled={isAssetModelDisabled}
          isLoadingResources={isLoadingResources}
          error={error}
          selectionMode={selectionMode}
          selectedResources={selectedAssetModels}
          onSelectResource={onSelectAssetModel}
          isFilterEnabled={isDropDownFilterEnabled}
        />
      }
    />
  );
}

function createResourceKey({ assetModelId }: AssetModelResource): string {
  return assetModelId;
}
