import { useState } from 'react';
import type { ExtendedPanelAssetSummary } from './nextResourceExplorer';

export interface AssetPropertiesCache {
  [key: string]: ExtendedPanelAssetSummary[];
}

export function useAssetProperties() {
  const [cache, setCache] = useState<AssetPropertiesCache>({});

  function update(id: string, properties: ExtendedPanelAssetSummary[]) {
    setCache((prevCache) => ({ ...prevCache, [id]: properties }));
  }

  function hasKey(id: string) {
    return id in cache;
  }

  return { cache, hasKey, update };
}
