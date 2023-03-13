import {
  AssetState
} from "@aws-sdk/client-iotsitewise";
import { ASSET_MODEL_ID } from "./assetModel";
import type { AssetSummary, DescribeAssetModelResponse, DescribeAssetResponse } from "@aws-sdk/client-iotsitewise";

export const ASSET_SUMMARY: AssetSummary = {
  id: 'some-asset-id',
  name: 'some-asset-summary-name',
  assetModelId: 'some-asset-model-id',
  creationDate: undefined,
  lastUpdateDate: undefined,
  status: undefined,
  hierarchies: [],
  arn: undefined,
};

export const DESCRIBE_ASSET_RESPONSE: DescribeAssetResponse = {
  assetId: 'some-asset-id',
  assetName: 'some-asset-summary-name',
  assetModelId: 'some-asset-model-id',
  assetCreationDate: undefined,
  assetLastUpdateDate: undefined,
  assetStatus: undefined,
  assetHierarchies: [],
  assetProperties: [],
  assetArn: undefined
};

export const ASSET_ID = "assetABC123";
export const sampleAssetSummary: AssetSummary = {
  id: ASSET_ID,
  assetModelId: ASSET_MODEL_ID,
  name: "assetName",
  arn: "arn:assetArn",
  creationDate: new Date(2000, 0, 0),
  lastUpdateDate: new Date(2021, 0, 0),
  hierarchies: [],
  status: {
    error: {
      code: undefined,
      details: undefined,
      message: undefined
    },
    state: AssetState.ACTIVE
  }
};
export const sampleAssetDescription: DescribeAssetResponse = {
  assetId: ASSET_ID,
  assetModelId: ASSET_MODEL_ID,
  assetName: "assetName",
  assetArn: "arn:assetArn",
  assetCreationDate: new Date(2000, 0, 0),
  assetLastUpdateDate: new Date(2021, 0, 0),
  assetHierarchies: [],
  assetStatus: {
    error: {
      code: undefined,
      details: undefined,
      message: undefined
    },
    state: AssetState.ACTIVE
  },
  assetCompositeModels: [],
  assetProperties: []
};

export const createAssetResponse = ({
 assetId,
 assetModelId,
}: {
  assetId: string;
  assetModelId: string;
}): DescribeAssetResponse => ({
  assetId: assetId,
  assetName: `${assetId}-name`,
  assetModelId,
  assetCreationDate: undefined,
  assetLastUpdateDate: undefined,
  assetStatus: undefined,
  assetHierarchies: [],
  assetProperties: [],
  assetArn: undefined,
});

export const createAssetModelResponse = ({
  propertyId,
  assetModelId,
  propertyName = 'property-name',
}: {
  propertyId: string;
  assetModelId: string;
  propertyName: string;
}): DescribeAssetModelResponse => ({
  assetModelId,
  assetModelName: `${assetModelId}-name`,
  assetModelDescription: undefined,
  assetModelProperties: [
    {
      id: propertyId,
      dataType: 'DOUBLE',
      name: propertyName,
      unit: 'm/s',
      type: undefined,
    },
  ],
  assetModelStatus: undefined,
  assetModelCompositeModels: [],
  assetModelHierarchies: [],
  assetModelCreationDate: undefined,
  assetModelLastUpdateDate: undefined,
  assetModelArn: undefined,
});

