import { IotAppKitDataModule } from '@iot-app-kit/core';
import { SiteWiseComponentSession } from './component-session';
import { SiteWiseAssetSession } from './asset-modules';
import { SiteWiseAlarmModule } from './alarms/iotevents';

export const timeSeriesDataSession = (session: SiteWiseComponentSession): IotAppKitDataModule => {
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
