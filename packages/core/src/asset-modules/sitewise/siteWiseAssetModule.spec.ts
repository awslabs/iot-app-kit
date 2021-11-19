import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { SiteWiseAssetModule } from './siteWiseAssetModule';

it('initializes', () => {
  expect(() => new SiteWiseAssetModule(new IoTSiteWiseClient({ region: 'us-east' }))).not.toThrowError();
});

describe('startSession', () => {
  const module = new SiteWiseAssetModule(new IoTSiteWiseClient({ region: 'us-east' }));
  it('getSession', () => {
    expect(() => module.startSession()).not.toBeUndefined();
  });
});
