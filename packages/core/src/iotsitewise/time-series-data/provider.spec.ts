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

it('subscribes, updates, and unsubscribes to time series data by delegating to underlying data modules', () => {
  // implement me
  expect(1).toBe(1);
});
