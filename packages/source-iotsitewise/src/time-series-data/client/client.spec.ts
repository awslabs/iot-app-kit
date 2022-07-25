import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { SiteWiseClient } from './client';
import { createMockSiteWiseSDK } from '../../__mocks__/iotsitewiseSDK';
import {
  BATCH_ASSET_PROPERTY_DOUBLE_VALUE,
  BATCH_ASSET_PROPERTY_VALUE_HISTORY,
  BATCH_ASSET_PROPERTY_ERROR,
  BATCH_ASSET_PROPERTY_ERROR_ENTRY,
  BATCH_ASSET_PROPERTY_AGGREGATES,
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
    const batchGetAssetPropertyValueHistory = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_ERROR);
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
  it('calls onError when error occurs', async () => {
    const batchGetAssetPropertyValue = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_ERROR);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const client = new SiteWiseClient(createMockSiteWiseSDK({ batchGetAssetPropertyValue }));

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

    expect(onError).toBeCalledWith(
      expect.objectContaining({
        error: {
          msg: BATCH_ASSET_PROPERTY_ERROR_ENTRY.errorMessage,
          status: BATCH_ASSET_PROPERTY_ERROR_ENTRY.errorCode,
        },
      })
    );
  });

  it('batches', async () => {
    const batchGetAssetPropertyValue = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_DOUBLE_VALUE);
    const assetId1 = 'some-asset-id-1';
    const propertyId1 = 'some-property-id-1';

    const assetId2 = 'some-asset-id-2';
    const propertyId2 = 'some-property-id-2';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ batchGetAssetPropertyValue }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);
    const resolution = '0';

    const requestInformation1 = {
      id: toId({ assetId: assetId1, propertyId: propertyId1 }),
      start: startDate,
      end: endDate,
      resolution,
      fetchMostRecentBeforeEnd: true,
    };

    const requestInformation2 = {
      id: toId({ assetId: assetId2, propertyId: propertyId2 }),
      start: startDate,
      end: endDate,
      resolution,
      fetchMostRecentBeforeEnd: true,
    };

    // batches requests that are sent on a single frame
    client.getLatestPropertyDataPoint({
      requestInformations: [requestInformation1],
      onSuccess,
      onError,
    });
    client.getLatestPropertyDataPoint({
      requestInformations: [requestInformation2],
      onSuccess,
      onError,
    });

    await flushPromises();

    // process the batch and paginate once
    expect(batchGetAssetPropertyValue).toBeCalledTimes(1);

    const batchLatestParams = [
      expect.objectContaining({
        entries: expect.arrayContaining([
          expect.objectContaining({
            assetId: assetId1,
            propertyId: propertyId1,
          }),
          expect.objectContaining({
            assetId: assetId2,
            propertyId: propertyId2,
          }),
        ]),
      }),
    ];

    expect(batchGetAssetPropertyValue.mock.calls).toEqual([batchLatestParams]);

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
          ],
          resolution: 0,
        }),
      ]),
      expect.objectContaining({
        id: toId({ assetId: assetId1, propertyId: propertyId1 }),
        start: startDate,
        end: endDate,
        resolution,
        fetchMostRecentBeforeEnd: true,
      }),
      new Date(0, 0, 0),
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
          resolution: 0,
        }),
      ]),
      expect.objectContaining({
        id: toId({ assetId: assetId2, propertyId: propertyId2 }),
        start: startDate,
        end: endDate,
        resolution,
        fetchMostRecentBeforeEnd: true,
      }),
      new Date(0, 0, 0),
      endDate,
    ];

    // call onSuccess for each entry in the batch
    expect(onSuccess).toBeCalledTimes(2);
    expect(onSuccess.mock.calls).toEqual([onSuccessParams1, onSuccessParams2]);
  });
});

describe('getAggregatedPropertyDataPoints', () => {
  it('calls onError on failure', async () => {
    const batchGetAssetPropertyAggregates = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_ERROR);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ batchGetAssetPropertyAggregates }));

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

    await client.getAggregatedPropertyDataPoints({ requestInformations, onSuccess, onError, aggregateTypes });

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
    const batchGetAssetPropertyAggregates = jest
      .fn()
      .mockResolvedValue({ ...BATCH_ASSET_PROPERTY_AGGREGATES, nextToken: 'nextToken' });
    const assetId1 = 'some-asset-id-1';
    const propertyId1 = 'some-property-id-1';

    const assetId2 = 'some-asset-id-2';
    const propertyId2 = 'some-property-id-2';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ batchGetAssetPropertyAggregates }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);
    const resolution = '1h';
    const aggregateTypes = [AggregateType.AVERAGE];

    const requestInformation1 = {
      id: toId({ assetId: assetId1, propertyId: propertyId1 }),
      start: startDate,
      end: endDate,
      resolution,
      fetchFromStartToEnd: true,
    };

    const requestInformation2 = {
      id: toId({ assetId: assetId2, propertyId: propertyId2 }),
      start: startDate,
      end: endDate,
      resolution,
      fetchFromStartToEnd: true,
    };

    // batches requests that are sent on a single frame
    client.getAggregatedPropertyDataPoints({
      requestInformations: [requestInformation1],
      onSuccess,
      onError,
      aggregateTypes,
      maxResults: MAX_BATCH_RESULTS, // ensure pagination happens exactly once
    });
    client.getAggregatedPropertyDataPoints({
      requestInformations: [requestInformation2],
      onSuccess,
      onError,
      aggregateTypes,
      maxResults: MAX_BATCH_RESULTS, // ensure pagination happens exactly once
    });

    await flushPromises();

    // process the batch and paginate once
    expect(batchGetAssetPropertyAggregates).toBeCalledTimes(2);

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

    expect(batchGetAssetPropertyAggregates.mock.calls).toEqual([batchHistoryParams, batchHistoryParams]);

    expect(onError).not.toBeCalled();

    const onSuccessParams1 = [
      expect.arrayContaining([
        expect.objectContaining({
          id: toId({ assetId: assetId1, propertyId: propertyId1 }),
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
          data: [],
          resolution: HOUR_IN_MS,
        }),
      ]),
      expect.objectContaining({
        id: toId({ assetId: assetId1, propertyId: propertyId1 }),
        start: startDate,
        end: endDate,
        resolution,
        fetchFromStartToEnd: true,
      }),
      startDate,
      endDate,
    ];

    const onSuccessParams2 = [
      expect.arrayContaining([
        expect.objectContaining({
          id: toId({ assetId: assetId2, propertyId: propertyId2 }),
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
          data: [],
          resolution: HOUR_IN_MS,
        }),
      ]),
      expect.objectContaining({
        id: toId({ assetId: assetId2, propertyId: propertyId2 }),
        start: startDate,
        end: endDate,
        resolution,
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

describe('batch duration', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('batches requests over a single frame', async () => {
    const batchGetAssetPropertyValue = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_DOUBLE_VALUE);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ batchGetAssetPropertyValue }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);
    const resolution = '0';

    const requestInformation = {
      id: toId({ assetId, propertyId }),
      start: startDate,
      end: endDate,
      resolution,
      fetchMostRecentBeforeEnd: true,
    };

    // single frame
    client.getLatestPropertyDataPoint({
      requestInformations: [requestInformation],
      onSuccess,
      onError,
    });
    client.getLatestPropertyDataPoint({
      requestInformations: [requestInformation],
      onSuccess,
      onError,
    });

    await flushPromises(); // clear promise queue
    jest.advanceTimersByTime(0); // ensure latest requests are enqueued

    // process the batch
    expect(batchGetAssetPropertyValue).toBeCalledTimes(1);

    // now split into two frames
    batchGetAssetPropertyValue.mockClear();

    client.getLatestPropertyDataPoint({
      requestInformations: [requestInformation],
      onSuccess,
      onError,
    });

    await flushPromises(); // clear promise queue
    jest.advanceTimersByTime(0); // ensure latest requests are enqueued

    client.getLatestPropertyDataPoint({
      requestInformations: [requestInformation],
      onSuccess,
      onError,
    });

    await flushPromises(); // clear promise queue
    jest.advanceTimersByTime(0); // ensure latest requests are enqueued

    expect(batchGetAssetPropertyValue).toBeCalledTimes(2);
  });

  it('batches requests over a specified duration', async () => {
    const batchGetAssetPropertyValue = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_DOUBLE_VALUE);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ batchGetAssetPropertyValue }), { batchDuration: 100 });

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);
    const resolution = '0';

    const requestInformation = {
      id: toId({ assetId, propertyId }),
      start: startDate,
      end: endDate,
      resolution,
      fetchMostRecentBeforeEnd: true,
    };

    client.getLatestPropertyDataPoint({
      requestInformations: [requestInformation],
      onSuccess,
      onError,
    });

    await flushPromises(); // clear promise queue
    jest.advanceTimersByTime(50); // ensure latest requests are enqueued but not outside of batch window

    client.getLatestPropertyDataPoint({
      requestInformations: [requestInformation],
      onSuccess,
      onError,
    });

    await flushPromises(); // clear promise queue
    jest.advanceTimersByTime(100); // ensure latest requests are enqueued and outside of batch window

    await flushPromises();

    // process the batch and paginate once
    expect(batchGetAssetPropertyValue).toBeCalledTimes(1);

    // now split into two separate batch windows
    batchGetAssetPropertyValue.mockClear();

    client.getLatestPropertyDataPoint({
      requestInformations: [requestInformation],
      onSuccess,
      onError,
    });

    await flushPromises();
    jest.advanceTimersByTime(150); // ensure latest requests are enqueued and outside of batch window

    client.getLatestPropertyDataPoint({
      requestInformations: [requestInformation],
      onSuccess,
      onError,
    });

    await flushPromises();
    jest.advanceTimersByTime(150); // ensure latest requests are enqueued and outside of batch window

    expect(batchGetAssetPropertyValue).toBeCalledTimes(2);
  });
});
