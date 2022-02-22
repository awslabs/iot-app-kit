import { IoTAppKitComponentSession, SiteWiseAssetTreeSession } from './index';
import { DataModule } from './data-module/types';
import { SiteWiseAssetSession } from '.';
import { SiteWiseComponentSession } from './iotsitewise/component-session';

/**
 * Extensible datamodule namespace exposing module sessions.
 */
export namespace datamodule.iotsitewise {
  export function timeSeriesDataSession(session: IoTAppKitComponentSession): DataModule {
    return (session as SiteWiseComponentSession).siteWiseTimeSeriesModule; // casting to hide modules from public interface
  }

  export function assetDataSession(session: IoTAppKitComponentSession): SiteWiseAssetSession {
    const assetSession = (session as SiteWiseComponentSession).siteWiseAssetModule.startSession();
    session.attachDataModuleSession(assetSession);
    return assetSession;
  }
}
