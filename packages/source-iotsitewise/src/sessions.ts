import { TimeSeriesDataModule } from '@iot-app-kit/core';
import { SiteWiseComponentSession } from './component-session';
import { SiteWiseAssetSession } from './asset-modules';
import { SiteWiseAlarmModule } from './alarms/iotevents';
import type { SiteWiseDataStreamQuery } from './time-series-data/types';

export const timeSeriesDataSession = (
  session: SiteWiseComponentSession
): TimeSeriesDataModule<SiteWiseDataStreamQuery> => {
  return session.siteWiseTimeSeriesModule;
};

export const assetSession = (
  session: SiteWiseComponentSession
): SiteWiseAssetSession => {
  const assetSession = session.siteWiseAssetModule.startSession();
  session.attachDataModuleSession(assetSession);
  return assetSession;
};

export const alarmsSession = (
  session: SiteWiseComponentSession
): SiteWiseAlarmModule => {
  return session.siteWiseAlarmModule;
};
