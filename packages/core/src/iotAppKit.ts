import { IotAppKitDataModule } from './data-module/IotAppKitDataModule';
import { sitewiseSdk } from './iotsitewise/time-series-data/sitewise-sdk';
import { SiteWiseAssetDataSource } from './data-module/types';
import { createSiteWiseAssetDataSource } from './iotsitewise/time-series-data/asset-data-source';
import { SiteWiseAssetModule } from './asset-modules';
import { IoTAppKitInitInputs, IoTAppKitComponentSession, IoTAppKit } from './interface.d';
import { createDataSource } from './iotsitewise/time-series-data';
import { AppKitComponentSession } from './app-kit-component-session';

/**
 * Initialize IoT App Kit
 *
 * @param awsCredentials - https://www.npmjs.com/package/@aws-sdk/credential-providers
 * @param awsRegion - Region for AWS based data sources to point towards, i.e. us-east-1
 */
export const initialize = (input: IoTAppKitInitInputs): IoTAppKit => {
  const siteWiseTimeSeriesModule = new IotAppKitDataModule();
  const siteWiseSdk =
    'iotSiteWiseClient' in input ? input.iotSiteWiseClient : sitewiseSdk(input.awsCredentials, input.awsRegion);

  const assetDataSource: SiteWiseAssetDataSource = createSiteWiseAssetDataSource(siteWiseSdk);
  const siteWiseAssetModule = new SiteWiseAssetModule(assetDataSource);

  if (input.registerDataSources !== false) {
    /** Automatically registered data sources */
    siteWiseTimeSeriesModule.registerDataSource(createDataSource(siteWiseSdk));
  }

  return {
    session: (componentId: string): IoTAppKitComponentSession =>
      new AppKitComponentSession({ componentId, siteWiseTimeSeriesModule, siteWiseAssetModule }),
  };
};
