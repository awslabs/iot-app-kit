import { useEffect, useState } from 'react';
import { DescribeAssetCommandOutput } from '@aws-sdk/client-iotsitewise';
import { ExtendedPanelAssetSummary } from '.';

export type AssetCache = Record<string, DescribeAssetCommandOutput | ExtendedPanelAssetSummary>;

export interface SearchCache {
  assets: any[];
  properties: any[];
  alarms: any[];
}

export function useAssetCache() {
  const [cache, setCache] = useState<AssetCache>({});
  const [searchCache, setSearchCache] = useState<SearchCache>({
    assets: [],
    properties: [],
    alarms: [],
  });

  function update(id: string, asset: DescribeAssetCommandOutput) {
    setCache((prevCache) => ({ ...prevCache, [id]: asset }));
  }

  function hasKey(id: string) {
    return id in cache;
  }

  useEffect(() => {
    const nextSearchCache = {
      assets: [],
      properties: [],
      alarms: [],
    } as SearchCache;

    Object.values(cache).forEach((asset) => {
      const assetClone = structuredClone(asset);
      assetClone.value = assetClone.assetName;

      nextSearchCache.assets.push(assetClone);

      assetClone?.assetProperties?.forEach((property: any) => {
        property.value = property.name;
        nextSearchCache.properties.push(property);
      });

      assetClone?.assetCompositeModels?.forEach((model: any) => {
        if (model.type === 'AWS/ALARM') {
          model.value = model.name;
          nextSearchCache.alarms.push(model);
        }
      });

      setSearchCache(nextSearchCache);
    });
  }, [JSON.stringify(cache)]);

  return { cache, searchCache, hasKey, update };
}
