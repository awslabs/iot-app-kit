import { SiteWiseAssetCache } from './cache';
import { LoadingStateEnum } from './types';
import {
  ASSET_ID,
  ASSET_MODEL_ID,
  ASSET_PROPERTY_ID,
  HIERARCHY_ID,
  sampleAssetDescription,
  sampleAssetModel,
  sampleAssetSummary,
  samplePropertyValue,
} from '../mocks';

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

describe('cacheAssetHierarchy', () => {
  const cache: SiteWiseAssetCache = new SiteWiseAssetCache();
  it('returns empty when the asset property value is not in the cache', () => {
    expect(cache.getHierarchy(HIERARCHY_ID)).toBeUndefined();
  });

  it('returns the cached hierarchy when one is stored', () => {
    cache.appendHierarchyResults(HIERARCHY_ID, [sampleAssetSummary], LoadingStateEnum.LOADING, 'next1');
    expect(cache.getHierarchy(HIERARCHY_ID)).toEqual({
      assetIds: [ASSET_ID],
      loadingStage: LoadingStateEnum.LOADING,
      paginationToken: 'next1',
    });
  });

  it('returns the combined records when a new one is appended', () => {
    cache.appendHierarchyResults(HIERARCHY_ID, [sampleAssetSummary], LoadingStateEnum.PAUSED, 'next2');
    expect(cache.getHierarchy(HIERARCHY_ID)).toEqual({
      assetIds: [ASSET_ID, ASSET_ID],
      loadingStage: LoadingStateEnum.PAUSED,
      paginationToken: 'next2',
    });
  });

  it('returns the updated loading state for a hierarchy when it is changed', () => {
    cache.setHierarchyLoadingState(HIERARCHY_ID, LoadingStateEnum.LOADED);
    expect(cache.getHierarchy(HIERARCHY_ID)).toEqual({
      assetIds: [ASSET_ID, ASSET_ID],
      loadingStage: LoadingStateEnum.LOADED,
      paginationToken: 'next2',
    });
  });
});
