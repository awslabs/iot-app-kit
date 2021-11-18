import { IotAppKitDataModule } from './IotAppKitDataModule';
import { DataModule } from './types.d';
import { createDataSource } from '../data-sources/site-wise/data-source';
import { sitewiseSdk } from '../data-sources/site-wise/sitewise-sdk';
import { Credentials, Provider } from '@aws-sdk/types';
import { SiteWiseAssetModule } from '../asset-modules';

/**
 * register data sources
 */

let dataModule: DataModule | undefined = undefined;
let siteWiseAssetModule: SiteWiseAssetModule | undefined = undefined;

/**
 * Initialize IoT App Kit
 *
 * @param awsCredentials - https://www.npmjs.com/package/@aws-sdk/credential-providers
 */
export const initialize = ({
  awsCredentials,
  registerDataSources = true,
}: {
  awsCredentials?: Credentials | Provider<Credentials>;
  registerDataSources?: boolean;
}) => {
  dataModule = new IotAppKitDataModule();

  if (registerDataSources && awsCredentials != null) {
    /** Automatically registered data sources */
    const siteWiseSdk = sitewiseSdk(awsCredentials);
    dataModule.registerDataSource(createDataSource(siteWiseSdk));
    siteWiseAssetModule = new SiteWiseAssetModule(siteWiseSdk);
  } else if (registerDataSources && awsCredentials == null) {
    console.warn(
      'site-wise data-source failed to register. Must provide field `awsCredentials` for the site-wise data-source to register.'
    );
  }
};

export const getDataModule = (): DataModule => {
  if (dataModule != null) {
    return dataModule;
  }
  throw new Error('No data module initialize: you must first call initialize to ensure a data module is present.');
};

export const getSiteWiseAssetModule = (): SiteWiseAssetModule => {
  if (siteWiseAssetModule != null) {
    return siteWiseAssetModule;
  }
  throw new Error('No SiteWiseAssetModule module initialize: you must first call initialize to ensure the SiteWiseAssetModule is present.');
};
