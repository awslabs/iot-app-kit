import { SiteWiseAssetTreeQuery } from './types';
import { SiteWiseAssetModule } from '../sitewise/siteWiseAssetModule';
import { SiteWiseAssetTreeSession } from './assetTreeSession';

export class SiteWiseAssetTreeModule {
  private assetModule: SiteWiseAssetModule;

  constructor(assetModule: SiteWiseAssetModule) {
    this.assetModule = assetModule;
  }

  public startSession(query: SiteWiseAssetTreeQuery) {
    return new SiteWiseAssetTreeSession(this.assetModule.startSession(), query);
  }
}
