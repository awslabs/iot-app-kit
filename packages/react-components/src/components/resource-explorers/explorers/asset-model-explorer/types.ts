import type { CommonResourceExplorerProps } from '../../types/resource-explorer';
import type { RequestFunctions, ListAssetModels } from '../../types/request-fn';
import type { AssetModelResource } from '../../types/resources';
import type {
  IsResourceDisabled,
  OnSelectResource,
  ResourceParameters,
  SelectedResources,
} from '../../types/common';

export interface AssetModelExplorerProps
  extends CommonResourceExplorerProps<AssetModelResource> {
  /**
   * Specify a list of request parameters for requesting asset models.
   *
   * @defaultValue `[{ }]` - All asset models will be requested.
   */
  parameters?: AssetModelParameters;
  requestFns?: AssetModelExplorerRequestFunctions;
  onSelectAssetModel?: OnSelectResource<AssetModelResource>;
  selectedAssetModels?: SelectedResources<AssetModelResource>;
  isAssetModelDisabled?: IsResourceDisabled<AssetModelResource>;
}

export type AssetModelParameters = ResourceParameters<{
  assetModelTypes?: AssetModelType[];
}>;

export type AssetModelType = NonNullable<
  Parameters<ListAssetModels>[0]['assetModelTypes']
>[number];

export type AssetModelExplorerRequestFunctions = RequestFunctions<{
  listAssetModels: ListAssetModels;
}>;
