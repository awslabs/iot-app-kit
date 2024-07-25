import { queryClient } from '../../queryClient';
import { AssetPropertyValuesCacheClient } from './cacheClient';
import { AssetPropertyValuesKeyManager } from './keyManager';

export const ASSET_PROPERTY_VALUES_KEY_MANAGER =
  new AssetPropertyValuesKeyManager();
export const ASSET_PROPERTY_VALUES_CACHE_CLIENT =
  new AssetPropertyValuesCacheClient({
    keyManager: ASSET_PROPERTY_VALUES_KEY_MANAGER,
    client: queryClient,
  });
