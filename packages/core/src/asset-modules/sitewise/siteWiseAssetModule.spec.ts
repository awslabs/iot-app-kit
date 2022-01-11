import { SiteWiseAssetModule } from './siteWiseAssetModule';
import { SiteWiseAssetDataSource } from '../../data-module/types';

it('initializes', () => {
  expect(() => new SiteWiseAssetModule({} as SiteWiseAssetDataSource)).not.toThrowError();
});

describe('startSession', () => {
  const module = new SiteWiseAssetModule({} as SiteWiseAssetDataSource);
  it('getSession', () => {
    expect(() => module.startSession()).not.toBeUndefined();
  });
});
