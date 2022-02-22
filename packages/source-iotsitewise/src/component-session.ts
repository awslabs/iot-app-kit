import { DataModuleSession, IotAppKitDataModule, Session } from '@iot-app-kit/core';
import { SiteWiseAssetModule } from './asset-modules';

/**
 * Component session to manage component data module sessions.
 * Contains a reference to sitewise data modules
 */
export class SiteWiseComponentSession implements Session {
  public componentId: string;

  public siteWiseTimeSeriesModule: IotAppKitDataModule;

  public siteWiseAssetModule: SiteWiseAssetModule;

  private sessions: DataModuleSession[] = [];

  constructor({
    componentId,
    siteWiseTimeSeriesModule,
    siteWiseAssetModule,
  }: {
    componentId: string;
    siteWiseTimeSeriesModule: IotAppKitDataModule;
    siteWiseAssetModule: SiteWiseAssetModule;
  }) {
    this.componentId = componentId;
    this.siteWiseTimeSeriesModule = siteWiseTimeSeriesModule;
    this.siteWiseAssetModule = siteWiseAssetModule;
  }

  attachDataModuleSession(session: DataModuleSession): void {
    this.sessions.push(session);
  }

  close(): void {
    this.sessions.forEach((session) => session.close());
  }
}
