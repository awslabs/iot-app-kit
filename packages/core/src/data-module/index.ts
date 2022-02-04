import { SiteWiseAssetModule } from '../asset-modules';

let siteWiseAssetModule: SiteWiseAssetModule | undefined = undefined;

export const getSiteWiseAssetModule = (): SiteWiseAssetModule => {
  if (siteWiseAssetModule != null) {
    return siteWiseAssetModule;
  }
  throw new Error(
    'No SiteWiseAssetModule module initialize: you must first call initialize to ensure the SiteWiseAssetModule is present.'
  );
};
