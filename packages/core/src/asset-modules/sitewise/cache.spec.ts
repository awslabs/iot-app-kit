import { SiteWiseAssetCache } from './cache';
import {
  AssetPropertyValue,
  AssetState,
  AssetSummary,
  DescribeAssetModelResponse,
  DescribeAssetResponse,
  Quality,
} from '@aws-sdk/client-iotsitewise';

const ASSET_ID = 'assetABC123';
const ASSET_MODEL_ID = 'assetModelABC123';
const ASSET_PROPERTY_ID = 'assetPropertyIdAbc123';
const creationDate: Date = new Date(2000, 0, 0);
const lastUpdatedDate: Date = new Date(2021, 0, 0);
const sampleAssetSummary: AssetSummary = {
  id: ASSET_ID,
  assetModelId: ASSET_MODEL_ID,
  name: 'assetName',
  arn: 'arn:assetArn',
  creationDate: creationDate,
  lastUpdateDate: lastUpdatedDate,
  hierarchies: [],
  status: {
    error: {
      code: undefined,
      details: undefined,
      message: undefined,
    },
    state: AssetState.ACTIVE,
  },
};
const sampleAssetDescription: DescribeAssetResponse = {
  assetId: ASSET_ID,
  assetModelId: ASSET_MODEL_ID,
  assetName: 'assetName',
  assetArn: 'arn:assetArn',
  assetCreationDate: creationDate,
  assetLastUpdateDate: lastUpdatedDate,
  assetHierarchies: [],
  assetStatus: {
    error: {
      code: undefined,
      details: undefined,
      message: undefined,
    },
    state: AssetState.ACTIVE,
  },
  assetCompositeModels: [],
  assetProperties: [],
};
const sampleAssetModel: DescribeAssetModelResponse = {
  assetModelId: ASSET_MODEL_ID,
  assetModelName: 'Asset Model Name',
  assetModelDescription: 'a happy little asset model',
  assetModelArn: 'arn:assetModelArn',
  assetModelCreationDate: creationDate,
  assetModelLastUpdateDate: lastUpdatedDate,
  assetModelProperties: [],
  assetModelCompositeModels: [],
  assetModelHierarchies: [],
  assetModelStatus: {
    error: {
      code: undefined,
      details: undefined,
      message: undefined,
    },
    state: AssetState.ACTIVE,
  },
};
const samplePropertyValue: AssetPropertyValue = {
  value: { stringValue: undefined, booleanValue: undefined, doubleValue: undefined, integerValue: 1234 },
  quality: Quality.GOOD,
  timestamp: {
    timeInSeconds: 100,
    offsetInNanos: 100,
  },
};

describe('cacheAssetSummary', () => {
  const cache: SiteWiseAssetCache = new SiteWiseAssetCache();
  it('returns empty when the asset summary is not in the cache', () => {
    expect(cache.getAssetSummary(ASSET_ID)).toBeUndefined();
  });

  it('returns the cached asset summary when one is stored', () => {
    cache.storeAssetSummary(sampleAssetSummary);
    expect(cache.getAssetSummary(ASSET_ID)).toEqual(sampleAssetSummary);
  });
});

describe('cacheDescribeAsset', () => {
  const cache: SiteWiseAssetCache = new SiteWiseAssetCache();
  it('returns empty when the asset summary is not in the cache', () => {
    expect(cache.getAssetSummary(ASSET_ID)).toBeUndefined();
  });

  it('returns the cached asset summary when an Asset Description is stored', () => {
    cache.storeAssetSummary(sampleAssetDescription);
    expect(cache.getAssetSummary(ASSET_ID)).toEqual(sampleAssetSummary);
  });
});

describe('cacheAssetModel', () => {
  const cache: SiteWiseAssetCache = new SiteWiseAssetCache();
  it('returns empty when the asset model is not in the cache', () => {
    expect(cache.getAssetModel(ASSET_MODEL_ID)).toBeUndefined();
  });

  it('returns the cached asset model when an Asset Model is stored', () => {
    cache.storeAssetModel(sampleAssetModel);
    expect(cache.getAssetModel(ASSET_MODEL_ID)).toEqual(sampleAssetModel);
  });
});

describe('cacheAssetPropertyValue', () => {
  const cache: SiteWiseAssetCache = new SiteWiseAssetCache();
  it('returns empty when the asset property value is not in the cache', () => {
    expect(cache.getPropertyValue(ASSET_ID, ASSET_PROPERTY_ID)).toBeUndefined();
  });

  it('returns the cached asset property value when an AssetPropertyValue is stored', () => {
    cache.storePropertyValue(ASSET_ID, ASSET_PROPERTY_ID, samplePropertyValue);
    expect(cache.getPropertyValue(ASSET_ID, ASSET_PROPERTY_ID)).toEqual(samplePropertyValue);
  });
});
