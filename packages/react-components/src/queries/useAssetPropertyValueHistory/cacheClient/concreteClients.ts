import { queryClient } from '../../queryClient';
import { AssetPropertyValueHistoryCacheClient } from './cacheClient';
import { AssetPropertyValueHistoryKeyManager } from './keyManager';

export const ASSET_PROPERTY_VALUE_HISTORY_KEY_MANAGER =
  new AssetPropertyValueHistoryKeyManager();
export const ASSET_PROPERTY_VALUE_HISTORY_CACHE_CLIENT =
  new AssetPropertyValueHistoryCacheClient({
    keyManager: ASSET_PROPERTY_VALUE_HISTORY_KEY_MANAGER,
    client: queryClient,
  });
