import { IotAppKitDataModule } from '@iot-app-kit/core';
import { SiteWiseComponentSession } from './component-session';
import { SiteWiseAssetSession } from './asset-modules';

export const timeSeriesDataSession = (session: SiteWiseComponentSession): IotAppKitDataModule => {
  return session.siteWiseTimeSeriesModule;
};

export const assetSession = (session: SiteWiseComponentSession): SiteWiseAssetSession => {
  const assetSession = session.siteWiseAssetModule.startSession();
  session.attachDataModuleSession(assetSession);
  return assetSession;
};
