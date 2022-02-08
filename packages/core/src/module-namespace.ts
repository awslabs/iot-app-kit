import { IoTAppKitComponentSession } from './interface';
import { DataModule } from './data-module/types';
import { SiteWiseAssetSession } from '.';
import { AppKitComponentSession } from './app-kit-component-session';

/**
 * Extensible datamodule namespace containing methods that return data module sessions.
 */
export namespace datamodule.iotsitewise {
  export function timeSeriesDataSession(session: IoTAppKitComponentSession): DataModule {
    // casting allows us to hide sitewise specific session properties such as modules from end-users
    return (session as AppKitComponentSession).siteWiseTimeSeriesModule;
  }

  export function assetDataSession(session: IoTAppKitComponentSession): SiteWiseAssetSession {
    const assetSession = (session as AppKitComponentSession).siteWiseAssetModule.startSession();
    session.attachDataModuleSession(assetSession);
    return assetSession;
  }
}
