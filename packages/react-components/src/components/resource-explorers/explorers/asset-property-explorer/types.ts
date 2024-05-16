import type {
  IsResourceDisabled,
  OnSelectResource,
  ResourceParameters,
  SelectedResources,
} from '../../types/common';
import type {
  BatchGetAssetPropertyValue,
  ExecuteQuery,
  ListAssetModelProperties,
  ListAssetProperties,
  RequestFunctions,
} from '../../types/request-fn';
import type { CommonResourceExplorerProps } from '../../types/resource-explorer';
import type { AssetPropertyResource } from '../../types/resources';

export interface AssetPropertyExplorerProps
  extends CommonResourceExplorerProps<AssetPropertyResource> {
  parameters?: AssetPropertyParameters;
  requestFns?: AssetPropertyExplorerRequestFunctions;
  onSelectAssetProperty?: OnSelectResource<AssetPropertyResource>;
  selectedAssetProperties?: SelectedResources<AssetPropertyResource>;
  isAssetPropertyDisabled?: IsResourceDisabled<AssetPropertyResource>;
}

export type AssetPropertyParameters = ResourceParameters<{
  assetId: string;
  assetModelId: string;
}>;

export type AssetPropertyExplorerRequestFunctions = RequestFunctions<{
  batchGetAssetPropertyValue: BatchGetAssetPropertyValue;
  executeQuery: ExecuteQuery;
  listAssetProperties: ListAssetProperties;
  listAssetModelProperties: ListAssetModelProperties;
}>;
