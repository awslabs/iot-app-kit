import { SiteWiseAssetCache } from './cache';
import { LoadingStateEnum } from './types';
import { ASSET_MODEL_ID, sampleAssetModel } from '../../iotsitewise/__mocks__/assetModel';
import { sampleAssetSummary } from '../../iotsitewise/__mocks__/asset';
import { ASSET_ID, sampleAssetDescription } from '../../iotsitewise/__mocks__/asset';
import { samplePropertyValue } from '../../iotsitewise/__mocks__/assetPropertyValue';

const ASSET_PROPERTY_ID = 'assetPropertyIdAbc123';
const HIERARCHY_ID = 'hierarchyIdAbc123';

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
