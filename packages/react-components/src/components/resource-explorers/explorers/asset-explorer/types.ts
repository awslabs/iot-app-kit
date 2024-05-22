import type {
  IsResourceDisabled,
  OnSelectResource,
  SelectedResources,
} from '../../types/common';
import type {
  ExecuteQuery,
  ListAssets,
  ListAssociatedAssets,
} from '../../types/request-fn';
import type { CommonResourceExplorerProps } from '../../types/resource-explorer';
import type { AssetResource } from '../../types/resources';

export interface AssetExplorerProps
  extends CommonResourceExplorerProps<AssetResource> {
  parameters?: AssetResourcesRequestParameters;
  requestFns?: {
    listAssets?: ListAssets;
    listAssociatedAssets?: ListAssociatedAssets;
    executeQuery?: ExecuteQuery;
  };
  onSelectAsset?: OnSelectResource<AssetResource>;
  selectedAssets?: SelectedResources<AssetResource>;
  isAssetDisabled?: IsResourceDisabled<AssetResource>;
}

export type AssetResourcesRequestParameters =
  | readonly ChildAssetsRequestParameters[]
  | readonly AssetModelAssetsRequestParameters[]
  | readonly SearchedAssetsRequestParameters[];

export interface ChildAssetsRequestParameters {
  assetId: string;
}

export interface SearchedAssetsRequestParameters {
  searchStatement: string;
}

export interface AssetModelAssetsRequestParameters {
  assetModelId: string;
}
