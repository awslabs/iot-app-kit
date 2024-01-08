import { SiteWiseAssetSession } from './session';
import { RequestProcessor } from './requestProcessor';
import { SiteWiseAssetCache } from './cache';
import type { SiteWiseAssetDataSource } from './types';

it('initializes', () => {
  expect(
    () =>
      new SiteWiseAssetSession(
        new RequestProcessor(
          {} as SiteWiseAssetDataSource,
          new SiteWiseAssetCache()
        )
      )
  ).not.toThrowError();
});
