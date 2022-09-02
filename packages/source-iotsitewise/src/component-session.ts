import { DataModuleSession, TimeSeriesDataModule, Session } from '@iot-app-kit/core';
import { SiteWiseAssetModule } from './asset-modules';
import { SiteWiseAssetDataStreamQuery } from './time-series-data/types';

/**
 * Component session to manage component data module sessions.
 * Contains a reference to sitewise data modules
 */
export class SiteWiseComponentSession implements Session {
  public componentId: string;

  public siteWiseTimeSeriesModule: TimeSeriesDataModule<SiteWiseAssetDataStreamQuery>;

  public siteWiseAssetModule: SiteWiseAssetModule;

  private sessions: DataModuleSession[] = [];

  constructor({
    componentId,
    siteWiseTimeSeriesModule,
    siteWiseAssetModule,
  }: {
    componentId: string;
    siteWiseTimeSeriesModule: TimeSeriesDataModule<SiteWiseAssetDataStreamQuery>;
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
