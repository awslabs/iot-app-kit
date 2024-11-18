import {
  type TimeSeriesDataModule,
  type DataModuleSession,
  type Session,
} from '@iot-app-kit/core';
import { type SiteWiseAssetModule } from './asset-modules';
import { type SiteWiseAlarmModule } from './alarms/iotevents';
import type { SiteWiseDataStreamQuery } from './time-series-data/types';

/**
 * Component session to manage component data module sessions.
 * Contains a reference to sitewise data modules
 */
export class SiteWiseComponentSession implements Session {
  public componentId: string;

  public siteWiseTimeSeriesModule: TimeSeriesDataModule<SiteWiseDataStreamQuery>;

  public siteWiseAssetModule: SiteWiseAssetModule;

  public siteWiseAlarmModule: SiteWiseAlarmModule;

  private sessions: DataModuleSession[] = [];

  constructor({
    componentId,
    siteWiseTimeSeriesModule,
    siteWiseAssetModule,
    siteWiseAlarmModule,
  }: {
    componentId: string;
    siteWiseTimeSeriesModule: TimeSeriesDataModule<SiteWiseDataStreamQuery>;
    siteWiseAssetModule: SiteWiseAssetModule;
    siteWiseAlarmModule: SiteWiseAlarmModule;
  }) {
    this.componentId = componentId;
    this.siteWiseTimeSeriesModule = siteWiseTimeSeriesModule;
    this.siteWiseAssetModule = siteWiseAssetModule;
    this.siteWiseAlarmModule = siteWiseAlarmModule;
  }

  attachDataModuleSession(session: DataModuleSession): void {
    this.sessions.push(session);
  }

  close(): void {
    this.sessions.forEach((session) => session.close());
  }
}
