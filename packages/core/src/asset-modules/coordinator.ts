import { SiteWiseAssetSession } from './sitewise/session';
import { SiteWiseAssetTreeObserver, SiteWiseAssetTreeQuery } from './sitewise-asset-tree/types';
import { SiteWiseAssetTreeSession } from './sitewise-asset-tree/assetTreeSession';

export const subscribeToAssetTree =
  (assetModuleSession: SiteWiseAssetSession) => (query: SiteWiseAssetTreeQuery, observer: SiteWiseAssetTreeObserver) =>
    new SiteWiseAssetTreeSession(assetModuleSession, query).subscribe(observer);
