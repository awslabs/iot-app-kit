import { SiteWiseAssetSession } from './session';
import { RequestProcessor } from './requestProcessor';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { SiteWiseAssetCache } from './cache';

it('initializes', () => {
  expect(() => new SiteWiseAssetSession(new RequestProcessor(
    new IoTSiteWiseClient({ region: 'us-east' }),
    new SiteWiseAssetCache()))).not.toThrowError();
});
