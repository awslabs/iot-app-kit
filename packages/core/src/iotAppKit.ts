import { IotAppKitDataModule } from './data-module/IotAppKitDataModule';
import { sitewiseSdk } from './iotsitewise/time-series-data/sitewise-sdk';
import { SiteWiseAssetDataSource } from './data-module/types';
import { createSiteWiseAssetDataSource } from './iotsitewise/time-series-data/asset-data-source';
import { SiteWiseAssetModule } from './asset-modules';
import { IoTAppKitSession, IoTAppKitInitInputs } from './interface.d';
import { createDataSource } from './iotsitewise/time-series-data';
import { subscribeToTimeSeriesData } from './iotsitewise/time-series-data/coordinator';
import { subscribeToAssetTree } from './asset-modules/coordinator';

/**
 * Initialize IoT App Kit
 *
 * @param awsCredentials - https://www.npmjs.com/package/@aws-sdk/credential-providers
 * @param awsRegion - Region for AWS based data sources to point towards, i.e. us-east-1
 */
export const initialize = (input: IoTAppKitInitInputs) => {
  const dataModule = new IotAppKitDataModule();
  const siteWiseSdk =
    'iotSiteWiseClient' in input ? input.iotSiteWiseClient : sitewiseSdk(input.awsCredentials, input.awsRegion);

  const assetDataSource: SiteWiseAssetDataSource = createSiteWiseAssetDataSource(siteWiseSdk);
  const siteWiseAssetModule = new SiteWiseAssetModule(assetDataSource);
  const siteWiseAssetModuleSession = siteWiseAssetModule.startSession();

  if (input.registerDataSources !== false) {
    /** Automatically registered data sources */
    dataModule.registerDataSource(createDataSource(siteWiseSdk));
  }

  return {
    session: (): IoTAppKitSession => ({
      subscribeToTimeSeriesData: subscribeToTimeSeriesData(dataModule, siteWiseAssetModuleSession),
      iotsitewise: {
        subscribeToAssetTree: subscribeToAssetTree(siteWiseAssetModuleSession),
      },
      registerDataSource: dataModule.registerDataSource,
    }),
  };
};
