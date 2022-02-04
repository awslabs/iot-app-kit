import { SiteWiseAssetSession } from './sitewise/session';
import { SiteWiseAssetTreeCallback, SiteWiseAssetTreeQuery } from './sitewise-asset-tree/types';
import { SiteWiseAssetTreeSession } from './sitewise-asset-tree/assetTreeSession';

export const subscribeToAssetTree =
  (assetModuleSession: SiteWiseAssetSession) => (query: SiteWiseAssetTreeQuery, callback: SiteWiseAssetTreeCallback) =>
    new SiteWiseAssetTreeSession(assetModuleSession, query).subscribe(callback);
