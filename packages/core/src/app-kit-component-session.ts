import { SiteWiseAssetModule } from '.';
import { IotAppKitDataModule } from './data-module/IotAppKitDataModule';
import { IoTAppKitComponentSession, DataModuleSession } from './interface.d';

/**
 * Component session to manage component data module sessions.
 * Contains a reference to sitewise data modules
 */
export class AppKitComponentSession implements IoTAppKitComponentSession {
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
