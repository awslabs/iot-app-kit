import { IotAppKitDataModule } from './data-module/IotAppKitDataModule';
import { sitewiseSdk } from './iotsitewise/time-series-data/sitewise-sdk';
import { SiteWiseAssetDataSource } from './data-module/types';
import { createSiteWiseAssetDataSource } from './iotsitewise/time-series-data/asset-data-source';
import { SiteWiseAssetModule } from './asset-modules';
import { IoTAppKitInitInputs, IoTAppKitComponentSession } from './index';
import { createDataSource } from './iotsitewise/time-series-data';
import { subscribeToAssetTree } from './asset-modules/coordinator';
import { SiteWiseComponentSession } from './iotsitewise/component-session';

/**
 * Initialize IoT App Kit
 *
 * @param awsCredentials - https://www.npmjs.com/package/@aws-sdk/credential-providers
 * @param awsRegion - Region for AWS based data sources to point towards, i.e. us-east-1
 */
export const initialize = (input: IoTAppKitInitInputs) => {
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
      new SiteWiseComponentSession({ componentId, siteWiseTimeSeriesModule, siteWiseAssetModule }),
    registerTimeSeriesDataSource: siteWiseTimeSeriesModule.registerDataSource,
    /** @todo: create asset provider */
    subscribeToAssetTree: subscribeToAssetTree(siteWiseAssetModule.startSession()),
  };
};
