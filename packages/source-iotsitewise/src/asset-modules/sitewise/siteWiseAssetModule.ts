import { type SiteWiseAssetSession } from './session';
import { SiteWiseAssetCache } from './cache';
import { RequestProcessor } from './requestProcessor';
import type {
  SiteWiseAssetDataSource,
  SiteWiseAssetModuleInterface,
} from './types';

export class SiteWiseAssetModule implements SiteWiseAssetModuleInterface {
  private readonly api: SiteWiseAssetDataSource;
  private readonly assetCache: SiteWiseAssetCache;
  private readonly requestProcessor: RequestProcessor;

  constructor(api: SiteWiseAssetDataSource) {
    this.api = api;
    this.assetCache = new SiteWiseAssetCache();
    this.requestProcessor = new RequestProcessor(this.api, this.assetCache);
  }

  public startSession(): SiteWiseAssetSession {
    return this.requestProcessor.startSession();
  }
}
