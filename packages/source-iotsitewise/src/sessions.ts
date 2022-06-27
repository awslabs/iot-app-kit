import { TimeSeriesDataModule } from '@iot-app-kit/core';
import { SiteWiseComponentSession } from './component-session';
import { SiteWiseAssetSession } from './asset-modules';
import { SiteWiseAssetDataStreamQuery } from './time-series-data/types';
import { SiteWiseAlarmModule } from './alarms/iotevents';

export const timeSeriesDataSession = (
  session: SiteWiseComponentSession
): TimeSeriesDataModule<SiteWiseAssetDataStreamQuery> => {
  return session.siteWiseTimeSeriesModule;
};

export const assetSession = (session: SiteWiseComponentSession): SiteWiseAssetSession => {
  const assetSession = session.siteWiseAssetModule.startSession();
  session.attachDataModuleSession(assetSession);
  return assetSession;
};

export const alarmsSession = (session: SiteWiseComponentSession): SiteWiseAlarmModule => {
  return session.siteWiseAlarmModule;
};
