import { SiteWiseAssetSession } from './session';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { SiteWiseAssetCache } from './cache';
import { RequestProcessor } from './requestProcessor';
import { SiteWiseAssetModuleInterface } from './types';
import { SiteWiseAssetDataSource } from '../../data-module/types';

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
