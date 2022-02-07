import { IoTAppKitComponentSession } from './interface';
import { DataModule } from './data-module/types';
import { SiteWiseAssetSession } from '.';

export namespace datamodule.iotsitewise {
  export function timeSeriesData(session: IoTAppKitComponentSession): DataModule {
    /** @todo - refactor data module to utilize session */
    return window.iotsitewise.timeSeriesDataModule;
  }

  export function assetData(session: IoTAppKitComponentSession): SiteWiseAssetSession {
    const assetSession = window.iotsitewise.assetModule.startSession();
    session.attachDataModuleSession(assetSession);
    return assetSession;
  }
}
