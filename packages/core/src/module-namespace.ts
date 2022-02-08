import { IoTAppKitComponentSession } from './interface';
import { DataModule } from './data-module/types';
import { SiteWiseAssetSession } from '.';

/**
 * Extensible datamodule namespace containing methods that return data module sessions.
 */
export namespace datamodule.iotsitewise {
  export function timeSeriesDataSession(session: IoTAppKitComponentSession): DataModule {
    return session.siteWiseTimeSeriesModule;
  }

  export function assetDataSession(session: IoTAppKitComponentSession): SiteWiseAssetSession {
    const assetSession = session.siteWiseAssetModule.startSession();
    session.attachDataModuleSession(assetSession);
    return assetSession;
  }
}
