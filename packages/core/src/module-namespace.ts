import { IoTAppKitComponentSession } from './interface';
import { DataModule } from './data-module/types';
import { SiteWiseAssetSession } from '.';
import { AppKitComponentSession } from './app-kit-component-session';

/**
 * Extensible datamodule namespace exposing module sessions.
 */
export namespace datamodule.iotsitewise {
  export function timeSeriesDataSession(session: IoTAppKitComponentSession): DataModule {
    return (session as AppKitComponentSession).siteWiseTimeSeriesModule; // casting to hide modules from public interface
  }

  export function assetDataSession(session: IoTAppKitComponentSession): SiteWiseAssetSession {
    const assetSession = (session as AppKitComponentSession).siteWiseAssetModule.startSession();
    session.attachDataModuleSession(assetSession);
    return assetSession;
  }
}
