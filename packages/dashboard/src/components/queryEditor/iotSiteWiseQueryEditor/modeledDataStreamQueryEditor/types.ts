import {
  AssetPropertySummary,
  AssetModelPropertySummary,
} from '@aws-sdk/client-iotsitewise';

type ExtendedAssetPropertySummaryProperty = {
  externalId?: string;
  path?: [
    {
      id: string;
      name: string;
    }
  ];
};

export type NewAssetPropertySummary = AssetPropertySummary &
  ExtendedAssetPropertySummaryProperty;

export type NewAssetModelPropertySummary = AssetModelPropertySummary &
  ExtendedAssetPropertySummaryProperty;
export type NewListAssetPropertiesCommandOutput = {
  assetPropertySummaries: NewAssetPropertySummary[] | undefined;
};

export type NewListAssetModelPropertiesCommandOutput = {
  assetModelPropertySummaries: NewAssetModelPropertySummary[] | undefined;
};

export type SelectedAsset = {
  assetId: string;
  assetModelId: string;
};

export type SelectedAssetsPropsArray = SelectedAsset[];

export type AssetModelPropertySummaryMap = {
  [x: string]: NewAssetModelPropertySummary;
};
