import { AppKitComponentSession } from '../types';
import { SiteWiseIotDataModule } from '../SiteWiseIotDataModule';
import { SiteWiseIotDataSession } from '../SiteWiseIotDataSession';
import { AnyDataStreamQuery } from '../../interface';

/**
 * Singleton DataModules are bootstrapped when IotAppKit is initialized
 * NOT SOLVING FULL PLUGIN REGISTRATION RIGHT NOW
 */
const siteWiseIotDataModule = new SiteWiseIotDataModule({
  awsCredentials: {
    accessKeyId: 'ASIAXAS364UYWAZO33EG',
    secretAccessKey: 'meN7wu4BU28sceHAQ9ihBx5cZ9m9eDPA9RN5hgBr',
    sessionToken:
      'IQoJb3JpZ2luX2VjEFsaCXVzLWVhc3QtMSJHMEUCIGTKp9YFlq2g3+q99lAjLhvfjWS3gS9J0oBjSBl3sczxAiEAujH37YRzRqGHy3mc7iJhSL1rdg2sQR7hxI1oNRVHYMkqpgIIlP//////////ARAAGgw0ODIzMDI5NDQ1NjEiDBe8mg3W9JvfBTJGLCr6AcEERAZI6Fv6+9MlXlTRFsMthJ5JqtKA+cnbMvHbi4ylMZcaNZozUMVw4QOKep7hOJBY+3WnKC5EyZ7KJXG8QF8jjwZaHOu16HDEQFKwkKtyg6cxfsLYe6Eq938kwNqYHqW8wPW+aEeezBu5yUUoudDlR4JF1/l5krtAMBhokSt3LCoVDq2QfwbSlQVDfLMa40/CgJKtfj5dvRILpLKhcq4kN2eGoEJ07qO2GGlW/8DLBEjPCsbBOJrz9sp7p0eXUiKArbJMUfofo9gIEWpBfIRhFmpp56ou+cntkaY+lXQmIYzDbntBaz7wM5cIaTOodCptxdnNbq3uNk4wut/1jwY6nQHiKfm2zV/KvDLEBm/PyxRrD/DWUvwS1Ne6dX2azrQT8+dZoKgKvJxFypAhZ6p5Td0gUeQ+E5MHkd7wMtfcnLnJWvllVS1eW0AMDJURTXlG9cEw2pdbYfZVuZnKszmUNMe1u5D4CA217r4HDpDbcJRHrkL49dgvoOmav0EfSfisAfxBVNxTEg9Z3Fv421VxNwASRQ84nev5VE4SpRD0',
  },
});

export namespace datamodule.iotsitewise {
  export function timeSeriesData(
    session: AppKitComponentSession
    /* appKit: AppKit - support multiple IotAppKits? */
  ): SiteWiseIotDataSession<AnyDataStreamQuery> {
    return siteWiseIotDataModule.getSession(session);
  }
}
