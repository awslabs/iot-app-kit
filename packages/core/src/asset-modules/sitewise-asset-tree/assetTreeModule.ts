import { SiteWiseAssetTreeQuery } from './types';
import { SiteWiseAssetModule } from '../sitewise/siteWiseAssetModule';
import { SiteWiseAssetTreeSession } from './assetTreeSession';
import { SiteWiseAssetModuleInterface } from '../sitewise/types';

export class SiteWiseAssetTreeModule {
  private assetModule: SiteWiseAssetModuleInterface;

  constructor(assetModule: SiteWiseAssetModuleInterface) {
    this.assetModule = assetModule;
  }

  public startSession(query: SiteWiseAssetTreeQuery) {
    return new SiteWiseAssetTreeSession(this.assetModule.startSession(), query);
  }
}
