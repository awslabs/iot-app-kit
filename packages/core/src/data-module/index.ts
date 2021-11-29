import { DataModule, RegisterDataSource, SubscribeToDataStreams, SubscribeToDataStreamsFrom } from './types.d';
import { createDataSource } from '../data-sources/site-wise/data-source';
import { sitewiseSdk } from '../data-sources/site-wise/sitewise-sdk';
import { Credentials, Provider } from '@aws-sdk/types';
import { SiteWiseAssetModule } from '../asset-modules';
import { IotAppKitDataModule } from './IotAppKitDataModule';

let siteWiseAssetModule: SiteWiseAssetModule | undefined = undefined;

/**
 * Core public API
 */
export const registerDataSource: RegisterDataSource = (dataModule, ...inputs) =>
  dataModule.registerDataSource(...inputs);

export const subscribeToDataStreams: SubscribeToDataStreams = (dataModule, ...inputs) =>
  dataModule.subscribeToDataStreams(...inputs);

export const subscribeToDataStreamsFrom: SubscribeToDataStreamsFrom = (dataModule, ...inputs) =>
  dataModule.subscribeToDataStreamsFrom(...inputs);

/**
 * Initialize IoT App Kit
 *
 * @param awsCredentials - https://www.npmjs.com/package/@aws-sdk/credential-providers
 * @param awsRegion - Region for AWS based data sources to point towards, i.e. us-east-1
 */
export const initialize = ({
  awsCredentials,
  awsRegion,
  registerDataSources = true,
}: {
  awsCredentials?: Credentials | Provider<Credentials>;
  awsRegion?: string;
  registerDataSources?: boolean;
}): DataModule => {
  const dataModule = new IotAppKitDataModule();

  if (registerDataSources && awsCredentials != null) {
    /** Automatically registered data sources */
    const siteWiseSdk = sitewiseSdk(awsCredentials, awsRegion);
    siteWiseAssetModule = new SiteWiseAssetModule(siteWiseSdk);

    registerDataSource(dataModule, createDataSource(sitewiseSdk(awsCredentials, awsRegion)));
  } else if (registerDataSources && awsCredentials == null) {
    console.warn(
      'site-wise data-source failed to register. Must provide field `awsCredentials` for the site-wise data-source to register.'
    );
  }

  return dataModule;
};

export const getSiteWiseAssetModule = (): SiteWiseAssetModule => {
  if (siteWiseAssetModule != null) {
    return siteWiseAssetModule;
  }
  throw new Error(
    'No SiteWiseAssetModule module initialize: you must first call initialize to ensure the SiteWiseAssetModule is present.'
  );
};
