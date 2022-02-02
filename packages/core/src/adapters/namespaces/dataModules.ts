import { AppKitComponentSession } from '../types';
import { SiteWiseIotDataModule } from '../SiteWiseIotDataModule';
import { SiteWiseIotDataSession } from '../SiteWiseIotDataSession';

/**
 * Singleton DataModules are bootstrapped when IotAppKit is initialized
 */
const siteWiseIotDataModule = new SiteWiseIotDataModule({
  awsCredentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
});

export namespace DataModules {
  export function siteWiseIotData(
    session: AppKitComponentSession
    /* appKit: AppKit - support multiple IotAppKits? */
  ): SiteWiseIotDataSession {
    return siteWiseIotDataModule.getSession(session);
  }
}
