import { subscribeToTimeSeriesData } from './subscribeToTimeSeriesData';
import { createSiteWiseAssetDataSource } from '../asset-modules/asset-data-source';
import { createMockSiteWiseSDK } from '../__mocks__/iotsitewiseSDK';
import { TimeSeriesDataModule } from '@iot-app-kit/core';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import flushPromises from 'flush-promises';
import { createDataSource } from './data-source';
import { createAssetModelResponse, createAssetResponse } from '../__mocks__/asset';
import { toId } from './util/dataStreamId';
import { BATCH_ASSET_PROPERTY_VALUE_HISTORY } from '../__mocks__/assetPropertyValue';
import { SiteWiseAssetDataSource, SiteWiseAssetModule } from '../asset-modules';

const initializeSubscribeToTimeSeriesData = (client: IoTSiteWiseClient) => {
  const assetDataSource: SiteWiseAssetDataSource = createSiteWiseAssetDataSource(client);
  const siteWiseAssetModule = new SiteWiseAssetModule(assetDataSource);
  const siteWiseAssetModuleSession = siteWiseAssetModule.startSession();
  const dataModule = new TimeSeriesDataModule(createDataSource(client));

  return subscribeToTimeSeriesData(dataModule, siteWiseAssetModuleSession);
};

it('does not emit any data streams when empty query is subscribed to', async () => {
  const subscribe = initializeSubscribeToTimeSeriesData(createMockSiteWiseSDK());
  const cb = jest.fn();
  const { unsubscribe } = subscribe({ queries: [], request: { viewport: { duration: '5m' } } }, cb);

  await flushPromises();

  expect(cb).not.toBeCalled();
  unsubscribe();
});

it('unsubscribes', () => {
  const assetDataSource: SiteWiseAssetDataSource = createSiteWiseAssetDataSource(createMockSiteWiseSDK());
  const siteWiseAssetModule = new SiteWiseAssetModule(assetDataSource);
  const siteWiseAssetModuleSession = siteWiseAssetModule.startSession();
  const dataModule = new TimeSeriesDataModule(createDataSource(createMockSiteWiseSDK()));

  const unsubscribeSpy = jest.fn();
  jest.spyOn(dataModule, 'subscribeToDataStreams').mockImplementation(() => ({
    unsubscribe: unsubscribeSpy,
    update: async () => {},
  }));

  const subscribe = subscribeToTimeSeriesData(dataModule, siteWiseAssetModuleSession);
  const { unsubscribe } = subscribe({ queries: [], request: { viewport: { duration: '5m' } } }, () => {});
  unsubscribe();

  expect(unsubscribeSpy).toBeCalled();
});

it('provides time series data from iotsitewise', async () => {
  const ASSET_ID = 'some-asset-id';
  const PROPERTY_ID = 'some-property-id';
  const ASSET_MODEL_ID = 'some-asset-model-id';
  const PROPERTY_NAME = 'some-property-name';

  const batchGetAssetPropertyValueHistory = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY);
  const describeAsset = jest
    .fn()
    .mockImplementation(({ assetId }) =>
      Promise.resolve(createAssetResponse({ assetId: assetId as string, assetModelId: ASSET_MODEL_ID }))
    );
  const describeAssetModel = jest.fn().mockImplementation(({ assetModelId }) =>
    Promise.resolve(
      createAssetModelResponse({
        assetModelId: assetModelId as string,
        propertyId: PROPERTY_ID,
        propertyName: PROPERTY_NAME,
      })
    )
  );

  const subscribe = initializeSubscribeToTimeSeriesData(
    createMockSiteWiseSDK({
      describeAsset,
      describeAssetModel,
      batchGetAssetPropertyValueHistory,
    })
  );

  const cb = jest.fn();
  const { unsubscribe } = subscribe(
    {
      queries: [
        {
          assets: [
            {
              assetId: ASSET_ID,
              properties: [{ propertyId: PROPERTY_ID, resolution: '0' }],
            },
          ],
        },
      ],
      request: { viewport: { duration: '5m' }, settings: { fetchFromStartToEnd: true } },
    },
    cb
  );

  await flushPromises();

  // fetches the asset summary
  expect(describeAsset).toBeCalledTimes(1);
  expect(describeAsset).toBeCalledWith({ assetId: ASSET_ID });

  // fetches the asset model
  expect(describeAssetModel).toBeCalledTimes(1);
  expect(describeAssetModel).toBeCalledWith({ assetModelId: ASSET_MODEL_ID });

  // fetches historical data
  expect(batchGetAssetPropertyValueHistory).toBeCalledTimes(1);
  expect(batchGetAssetPropertyValueHistory).toBeCalledWith(
    expect.objectContaining({
      entries: expect.arrayContaining([
        expect.objectContaining({
          assetId: ASSET_ID,
          propertyId: PROPERTY_ID,
        }),
      ]),
    })
  );

  // provides the time series data
  expect(cb).toHaveBeenLastCalledWith(
    expect.objectContaining({
      dataStreams: [
        expect.objectContaining({
          id: toId({ assetId: ASSET_ID, propertyId: PROPERTY_ID }),
          name: PROPERTY_NAME,
          data: [
            { x: 1000099, y: 10.123 },
            { x: 2000000, y: 12.01 },
          ],
          dataType: 'NUMBER',
          unit: 'm/s',
        }),
      ],
    })
  );

  unsubscribe();
});

it('provides timeseries data from iotsitewise when subscription is updated', async () => {
  const ASSET_ID = 'some-asset-id';
  const PROPERTY_ID = 'some-property-id';
  const ASSET_MODEL_ID = 'some-asset-model-id';
  const PROPERTY_NAME = 'some-property-name';

  const batchGetAssetPropertyValueHistory = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY);
  const describeAsset = jest
    .fn()
    .mockImplementation(({ assetId }) =>
      Promise.resolve(createAssetResponse({ assetId: assetId as string, assetModelId: ASSET_MODEL_ID }))
    );
  const describeAssetModel = jest.fn().mockImplementation(({ assetModelId }) =>
    Promise.resolve(
      createAssetModelResponse({
        assetModelId: assetModelId as string,
        propertyId: PROPERTY_ID,
        propertyName: PROPERTY_NAME,
      })
    )
  );

  const subscribe = initializeSubscribeToTimeSeriesData(
    createMockSiteWiseSDK({
      describeAsset,
      describeAssetModel,
      batchGetAssetPropertyValueHistory,
    })
  );

  const cb = jest.fn();
  const { update, unsubscribe } = subscribe(
    {
      queries: [],
      request: { viewport: { duration: '5m' }, settings: { fetchFromStartToEnd: true } },
    },
    cb
  );

  await flushPromises();

  update({
    queries: [
      {
        assets: [
          {
            assetId: ASSET_ID,
            properties: [{ propertyId: PROPERTY_ID, resolution: '0' }],
          },
        ],
      },
    ],
  });

  await flushPromises();

  // fetches the asset summary
  expect(describeAsset).toBeCalledTimes(1);
  expect(describeAsset).toBeCalledWith({ assetId: ASSET_ID });

  // fetches the asset model
  expect(describeAssetModel).toBeCalledTimes(1);
  expect(describeAssetModel).toBeCalledWith({ assetModelId: ASSET_MODEL_ID });

  // fetches historical data
  expect(batchGetAssetPropertyValueHistory).toBeCalledTimes(1);
  expect(batchGetAssetPropertyValueHistory).toBeCalledWith(
    expect.objectContaining({
      entries: expect.arrayContaining([
        expect.objectContaining({
          assetId: ASSET_ID,
          propertyId: PROPERTY_ID,
        }),
      ]),
    })
  );

  // provides the time series data
  expect(cb).toHaveBeenLastCalledWith(
    expect.objectContaining({
      dataStreams: [
        expect.objectContaining({
          id: toId({ assetId: ASSET_ID, propertyId: PROPERTY_ID }),
          name: PROPERTY_NAME,
          data: [
            { x: 1000099, y: 10.123 },
            { x: 2000000, y: 12.01 },
          ],
          dataType: 'NUMBER',
          unit: 'm/s',
        }),
      ],
    })
  );

  unsubscribe();
});
