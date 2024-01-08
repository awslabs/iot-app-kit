import {
  createMockIoTEventsSDK,
  createMockSiteWiseSDK,
} from '@iot-app-kit/testing-util';
import { initialize } from './initialize';

it('converts a query to string with contents that uniquely represent the query', () => {
  const { query } = initialize({
    iotEventsClient: createMockIoTEventsSDK(),
    iotSiteWiseClient: createMockSiteWiseSDK(),
  });
  const timeSeriesDataQuery = query.timeSeriesData({
    assets: [{ assetId: 'windmill', properties: [{ propertyId: 'rpm' }] }],
  });
  expect(timeSeriesDataQuery.toQueryString()).toMatchInlineSnapshot(
    `"{"source":"iotsitewise","queryType":"time-series-data","query":{"assets":[{"assetId":"windmill","properties":[{"propertyId":"rpm"}]}]}}"`
  );
});

it('converts a asset query from root to string with contents that uniquely represent the query', () => {
  const { query } = initialize({
    iotEventsClient: createMockIoTEventsSDK(),
    iotSiteWiseClient: createMockSiteWiseSDK(),
  });
  const timeSeriesDataQuery = query.assetTree.fromRoot({
    withModels: true,
    withPropertyValues: ['rpm'],
  });
  expect(timeSeriesDataQuery.toQueryString()).toMatchInlineSnapshot(
    `"{"source":"iotsitewise","queryType":"assets-from-root","query":{"withModels":true,"withPropertyValues":["rpm"]}}"`
  );
});

it('converts a asset query from asset to string with contents that uniquely represent the query', () => {
  const { query } = initialize({
    iotEventsClient: createMockIoTEventsSDK(),
    iotSiteWiseClient: createMockSiteWiseSDK(),
  });
  const timeSeriesDataQuery = query.assetTree.fromAsset({
    asset: { assetId: 'my-asset-id' },
  });
  expect(timeSeriesDataQuery.toQueryString()).toMatchInlineSnapshot(
    `"{"source":"iotsitewise","queryType":"assets-from-asset","query":{"asset":{"assetId":"my-asset-id"}}}"`
  );
});
