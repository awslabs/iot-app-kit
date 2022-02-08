import { SiteWiseTimeSeriesDataProvider } from './provider';
import { createMockSiteWiseSDK, SiteWiseAssetModule } from '../..';
import { IotAppKitDataModule } from '../../data-module/IotAppKitDataModule';
import { createMockSiteWiseDataSource, DATA_STREAM_QUERY } from '../../data-module/IotAppKitDataModule.spec';
import { createSiteWiseAssetDataSource } from './asset-data-source';
import { DESCRIBE_ASSET_RESPONSE } from '../../testing/__mocks__/assetSummary';
import { AppKitComponentSession } from '../../app-kit-component-session';
import { DATA_STREAM } from '../../testing/__mocks__/mockWidgetProperties';

const timeSeriesModule = new IotAppKitDataModule();
const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
timeSeriesModule.registerDataSource(dataSource);

const assetModule = new SiteWiseAssetModule(
  createSiteWiseAssetDataSource(
    createMockSiteWiseSDK({
      describeAsset: () => Promise.resolve(DESCRIBE_ASSET_RESPONSE),
    })
  )
);

// it('subscribes, updates, and unsubscribes to time series data by delegating to underlying data modules', () => {
//   try {
//     const componentSession = new AppKitComponentSession({
//       componentId: 'componentId',
//       siteWiseAssetModule: assetModule,
//       siteWiseTimeSeriesModule: timeSeriesModule,
//     });

//     const START = new Date(2000, 0, 0);
//     const END = new Date();

//     const provider = new SiteWiseTimeSeriesDataProvider(componentSession, {
//       queries: [DATA_STREAM_QUERY],
//       request: { viewport: { start: START, end: END }, settings: { fetchFromStartToEnd: true } },
//     });

//     const callback = jest.fn();

//     provider.subscribe(callback);

//     expect(callback).toHaveBeenCalledWith({});
//   } catch (e) {
//     console.log(e);
//   }
// });
