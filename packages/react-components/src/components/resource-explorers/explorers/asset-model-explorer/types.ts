import type { CommonResourceExplorerProps } from '../../types/resource-explorer';
import type { ListAssetModels } from '@iot-app-kit/core';
import type { AssetModelResource } from '../../types/resources';
import type {
  IsResourceDisabled,
  OnSelectResource,
  SelectedResources,
} from '../../types/common';

export interface AssetModelExplorerProps
  extends CommonResourceExplorerProps<AssetModelResource> {
  /**
   * Specify a list of request parameters for requesting asset models.
   *
   * @defaultValue `[{ assetModelTypes: ['ASSET_MODEL'] }]` - All asset models of type ASSET_MODEL will be requested.
   */
  parameters?: readonly AssetModelParameters[];
  requestFns?: {
    listAssetModels?: ListAssetModels;
  };
  onSelectAssetModel?: OnSelectResource<AssetModelResource>;
  selectedAssetModels?: SelectedResources<AssetModelResource>;
  isAssetModelDisabled?: IsResourceDisabled<AssetModelResource>;
}

export type AssetModelParameters = {
  assetModelTypes?: AssetModelType[];
};

export type AssetModelType = NonNullable<
  Parameters<ListAssetModels>[0]['assetModelTypes']
>[number];
