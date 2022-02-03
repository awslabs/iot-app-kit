import { AppKitComponentSession } from '../types';
import { SiteWiseIotDataModule } from '../SiteWiseIotDataModule';
import { SiteWiseIotDataSession } from '../SiteWiseIotDataSession';
import { AnyDataStreamQuery } from '../../interface';

/**
 * Singleton DataModules are bootstrapped when IotAppKit is initialized
 */
const siteWiseIotDataModule = new SiteWiseIotDataModule({
  awsCredentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
});

export namespace dataModules {
  export function siteWiseIotData(
    session: AppKitComponentSession
    /* appKit: AppKit - support multiple IotAppKits? */
  ): SiteWiseIotDataSession<AnyDataStreamQuery> {
    return siteWiseIotDataModule.getSession(session);
  }
}
