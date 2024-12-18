import { type TableProps } from '@cloudscape-design/components';
import type {
  IsResourceDisabled,
  OnSelectResource,
  SelectedResources,
} from '../../types/common';
import type {
  BatchGetAssetPropertyValue,
  ExecuteQuery,
  ListAssetModelProperties,
  ListAssetProperties,
} from '@iot-app-kit/core';
import type { CommonResourceExplorerProps } from '../../types/resource-explorer';
import type { AssetPropertyResource } from '../../types/resources';

export interface AssetPropertyExplorerProps
  extends CommonResourceExplorerProps<AssetPropertyResource> {
  parameters?: AssetPropertyResourcesRequestParameters;
  iotSiteWiseClient?: {
    batchGetAssetPropertyValue?: BatchGetAssetPropertyValue;
    executeQuery?: ExecuteQuery;
    listAssetProperties?: ListAssetProperties;
    listAssetModelProperties?: ListAssetModelProperties;
  };
  onSelectAssetProperty?: OnSelectResource<AssetPropertyResource>;
  selectedAssetProperties?: SelectedResources<AssetPropertyResource>;
  isAssetPropertyDisabled?: IsResourceDisabled<AssetPropertyResource>;
  ariaLabels?: TableProps.AriaLabels<AssetPropertyResource>;
  description?: string;
  timeZone?: string;
  significantDigits?: number;
}

export type AssetPropertyResourcesRequestParameters =
  | readonly AssetPropertyRequestParameters[]
  | readonly SearchedAssetPropertiesRequestParameters[];

export interface AssetPropertyRequestParameters {
  assetId: string;
  assetModelId: string;
}

export interface SearchedAssetPropertiesRequestParameters {
  searchStatement: string;
}
