import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { SiteWiseClient } from './client';
import { createMockSiteWiseSDK } from '../../__mocks__/iotsitewiseSDK';
import {
  ASSET_PROPERTY_DOUBLE_VALUE,
  BATCH_ASSET_PROPERTY_VALUE_HISTORY,
  BATCH_ASSET_PROPERTY_VALUE_HISTORY_ERROR,
  BATCH_ASSET_PROPERTY_ERROR_ENTRY,
  AGGREGATE_VALUES,
} from '../../__mocks__/assetPropertyValue';
import { toId } from '../util/dataStreamId';
import { HOUR_IN_MS } from '@iot-app-kit/core';
import { MAX_BATCH_RESULTS } from './batch';
import flushPromises from 'flush-promises';

it('initializes', () => {
  expect(() => new SiteWiseClient(createMockSiteWiseSDK({}))).not.toThrowError();
});

describe('getHistoricalPropertyDataPoints', () => {
  it('calls onError on failure', async () => {
    const batchGetAssetPropertyValueHistory = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY_ERROR);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ batchGetAssetPropertyValueHistory }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);

    const requestInformations = [
      {
        id: toId({ assetId, propertyId }),
        start: startDate,
        end: endDate,
        resolution: '0',
        fetchFromStartToEnd: true,
      },
    ];

    await client.getHistoricalPropertyDataPoints({ requestInformations, onSuccess, onError });

    expect(onError).toBeCalledWith(
      expect.objectContaining({
        error: {
          msg: BATCH_ASSET_PROPERTY_ERROR_ENTRY.errorMessage,
          status: BATCH_ASSET_PROPERTY_ERROR_ENTRY.errorCode,
        },
      })
    );
  });

  it('batches and paginates', async () => {
    const batchGetAssetPropertyValueHistory = jest
      .fn()
      .mockResolvedValue({ ...BATCH_ASSET_PROPERTY_VALUE_HISTORY, nextToken: 'nextToken' });
    const assetId1 = 'some-asset-id-1';
    const propertyId1 = 'some-property-id-1';

    const assetId2 = 'some-asset-id-2';
    const propertyId2 = 'some-property-id-2';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ batchGetAssetPropertyValueHistory }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);

    const requestInformation1 = {
      id: toId({ assetId: assetId1, propertyId: propertyId1 }),
      start: startDate,
      end: endDate,
      resolution: '0',
      fetchFromStartToEnd: true,
    };

    const requestInformation2 = {
      id: toId({ assetId: assetId2, propertyId: propertyId2 }),
      start: startDate,
      end: endDate,
      resolution: '0',
      fetchFromStartToEnd: true,
    };

    // batches requests that are sent on a single frame
    client.getHistoricalPropertyDataPoints({
      requestInformations: [requestInformation1],
      onSuccess,
      onError,
      maxResults: MAX_BATCH_RESULTS, // ensure pagination happens exactly once
    });
    client.getHistoricalPropertyDataPoints({
      requestInformations: [requestInformation2],
      onSuccess,
      onError,
      maxResults: MAX_BATCH_RESULTS, // ensure pagination happens exactly once
    });

    await flushPromises();

    // process the batch and paginate once
    expect(batchGetAssetPropertyValueHistory).toBeCalledTimes(2);

    const batchHistoryParams = [
      expect.objectContaining({
        entries: expect.arrayContaining([
          expect.objectContaining({
            assetId: assetId1,
            propertyId: propertyId1,
            startDate,
            endDate,
          }),
          expect.objectContaining({
            assetId: assetId2,
            propertyId: propertyId2,
            startDate,
            endDate,
          }),
        ]),
      }),
    ];

    expect(batchGetAssetPropertyValueHistory.mock.calls).toEqual([batchHistoryParams, batchHistoryParams]);

    expect(onError).not.toBeCalled();

    const onSuccessParams1 = [
      expect.arrayContaining([
        expect.objectContaining({
          id: toId({ assetId: assetId1, propertyId: propertyId1 }),
          data: [
            {
              x: 1000099,
              y: 10.123,
            },
            {
              x: 2000000,
              y: 12.01,
            },
          ],
        }),
      ]),
      expect.objectContaining({
        id: toId({ assetId: assetId1, propertyId: propertyId1 }),
        start: startDate,
        end: endDate,
        resolution: '0',
        fetchFromStartToEnd: true,
      }),
      startDate,
      endDate,
    ];

    const onSuccessParams2 = [
      expect.arrayContaining([
        expect.objectContaining({
          id: toId({ assetId: assetId2, propertyId: propertyId2 }),
          data: [
            {
              x: 1000099,
              y: 10.123,
            },
          ],
        }),
      ]),
      expect.objectContaining({
        id: toId({ assetId: assetId2, propertyId: propertyId2 }),
        start: startDate,
        end: endDate,
        resolution: '0',
        fetchFromStartToEnd: true,
      }),
      startDate,
      endDate,
    ];

    // call onSuccess for each entry in each batch
    expect(onSuccess).toBeCalledTimes(4);
    expect(onSuccess.mock.calls).toEqual([onSuccessParams1, onSuccessParams2, onSuccessParams1, onSuccessParams2]);
  });
});

describe('getLatestPropertyDataPoint', () => {
  it.skip('returns data point on success', async () => {
    const getAssetPropertyValue = jest.fn().mockResolvedValue(ASSET_PROPERTY_DOUBLE_VALUE);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const start = new Date(1000099);
    const end = new Date();

    const requestInformations = [
      {
        id: toId({ assetId, propertyId }),
        start,
        end,
        resolution: '0',
        fetchMostRecentBeforeEnd: true,
      },
    ];

    const client = new SiteWiseClient(createMockSiteWiseSDK({ getAssetPropertyValue }));

    await client.getLatestPropertyDataPoint({ onSuccess, onError, requestInformations });
    expect(getAssetPropertyValue).toBeCalledWith({ assetId, propertyId });

    expect(onError).not.toBeCalled();

    expect(onSuccess).toBeCalledWith(
      [
        expect.objectContaining({
          id: toId({ assetId, propertyId }),
          data: [
            {
              y: ASSET_PROPERTY_DOUBLE_VALUE.propertyValue?.value?.doubleValue,
              x: 1000099,
            },
          ],
        }),
      ],
      expect.objectContaining({
        id: toId({ assetId, propertyId }),
        start,
        end,
        resolution: '0',
        fetchMostRecentBeforeEnd: true,
      }),
      start,
      end
    );
  });

  it('calls onError when error occurs', async () => {
    const ERR = new Error('some scary error');
    const getAssetPropertyValue = jest.fn().mockRejectedValue(ERR);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const client = new SiteWiseClient(createMockSiteWiseSDK({ getAssetPropertyValue }));

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const requestInformations = [
      {
        id: toId({ assetId, propertyId }),
        start: new Date(),
        end: new Date(),
        resolution: '0',
        fetchMostRecentBeforeEnd: true,
      },
    ];

    await client.getLatestPropertyDataPoint({ onSuccess, onError, requestInformations });

    expect(onSuccess).not.toBeCalled();
    expect(onError).toBeCalled();
  });
});

describe('getAggregatedPropertyDataPoints', () => {
  it('calls onError on failure', async () => {
    const ERR = new Error('some error');
    const getAssetPropertyAggregates = jest.fn().mockRejectedValue(ERR);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ getAssetPropertyAggregates }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);
    const resolution = '1h';
    const aggregateTypes = [AggregateType.AVERAGE];

    const requestInformations = [
      {
        id: toId({ assetId, propertyId }),
        start: startDate,
        end: endDate,
        resolution,
        fetchFromStartToEnd: true,
      },
    ];

    await client.getAggregatedPropertyDataPoints({
      requestInformations,
      onSuccess,
      onError,
      aggregateTypes,
    });

    expect(onError).toBeCalled();
  });

  it('returns data point on success', async () => {
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();
    const getAssetPropertyAggregates = jest.fn().mockResolvedValue(AGGREGATE_VALUES);

    const client = new SiteWiseClient(createMockSiteWiseSDK({ getAssetPropertyAggregates }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);
    const resolution = '1h';
    const aggregateTypes = [AggregateType.AVERAGE];

    const requestInformations = [
      {
        id: toId({ assetId, propertyId }),
        start: startDate,
        end: endDate,
        resolution,
        fetchFromStartToEnd: true,
      },
    ];

    await client.getAggregatedPropertyDataPoints({
      requestInformations,
      onSuccess,
      onError,
      aggregateTypes,
    });

    expect(getAssetPropertyAggregates).toBeCalledWith(
      expect.objectContaining({ assetId, propertyId, startDate, endDate, resolution, aggregateTypes })
    );

    expect(onError).not.toBeCalled();

    expect(onSuccess).toBeCalledWith(
      [
        expect.objectContaining({
          id: toId({ assetId, propertyId }),
          data: [],
          aggregates: {
            [HOUR_IN_MS]: [
              {
                x: 946602000000,
                y: 5,
              },
              {
                x: 946605600000,
                y: 7,
              },
              {
                x: 946609200000,
                y: 10,
              },
            ],
          },
        }),
      ],
      expect.objectContaining({
        id: toId({ assetId, propertyId }),
        start: startDate,
        end: endDate,
        resolution,
        fetchFromStartToEnd: true,
      }),
      startDate,
      endDate
    );
  });
});
