import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { SiteWiseClient } from './client';
import {
  BATCH_ASSET_PROPERTY_DOUBLE_VALUE,
  BATCH_ASSET_PROPERTY_VALUE_HISTORY,
  BATCH_ASSET_PROPERTY_ERROR,
  BATCH_ASSET_PROPERTY_ERROR_ENTRY,
  BATCH_ASSET_PROPERTY_AGGREGATES,
} from '../../__mocks__/assetPropertyValue';
import { toId } from '../util/dataStreamId';
import flushPromises from 'flush-promises';
import { HOUR_IN_MS } from '../util/timeConstants';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

const AGGREGATE_TYPE = AggregateType.AVERAGE;

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
      .mockResolvedValueOnce({ ...BATCH_ASSET_PROPERTY_VALUE_HISTORY, nextToken: 'nextToken' })
      .mockResolvedValue({ ...BATCH_ASSET_PROPERTY_VALUE_HISTORY });
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
    });
    client.getHistoricalPropertyDataPoints({
      requestInformations: [requestInformation2],
      onSuccess,
      onError,
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

  it('requests data by property alias', async () => {
    const batchGetAssetPropertyValueHistory = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY);
    const propertyAlias = 'some/property/alias';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ batchGetAssetPropertyValueHistory }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);

    const requestInformation1 = {
      id: toId({ propertyAlias }),
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
    });

    await flushPromises();

    // process the batch and paginate once
    expect(batchGetAssetPropertyValueHistory).toBeCalledTimes(1);

    const batchHistoryParams = [
      expect.objectContaining({
        entries: expect.arrayContaining([
          expect.objectContaining({
            propertyAlias,
            startDate,
            endDate,
          }),
        ]),
      }),
    ];

    expect(batchGetAssetPropertyValueHistory.mock.calls).toEqual([batchHistoryParams]);

    expect(onError).not.toBeCalled();

    const onSuccessParams1 = [
      expect.arrayContaining([
        expect.objectContaining({
          id: toId({ propertyAlias }),
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
        id: toId({ propertyAlias }),
        start: startDate,
        end: endDate,
        resolution: '0',
        fetchFromStartToEnd: true,
      }),
      startDate,
      endDate,
    ];

    // call onSuccess for each entry in each batch
    expect(onSuccess).toBeCalledTimes(1);
    expect(onSuccess.mock.calls).toEqual([onSuccessParams1]);
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

  it('requests data by property alias', async () => {
    const batchGetAssetPropertyValue = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_DOUBLE_VALUE);
    const propertyAlias = 'some/property/alias';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ batchGetAssetPropertyValue }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);
    const resolution = '0';

    const requestInformation1 = {
      id: toId({ propertyAlias }),
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

    await flushPromises();

    // process the batch and paginate once
    expect(batchGetAssetPropertyValue).toBeCalledTimes(1);

    const batchLatestParams = [
      expect.objectContaining({
        entries: expect.arrayContaining([
          expect.objectContaining({
            propertyAlias,
          }),
        ]),
      }),
    ];

    expect(batchGetAssetPropertyValue.mock.calls).toEqual([batchLatestParams]);

    expect(onError).not.toBeCalled();

    const onSuccessParams1 = [
      expect.arrayContaining([
        expect.objectContaining({
          id: toId({ propertyAlias }),
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
        id: toId({ propertyAlias }),
        start: startDate,
        end: endDate,
        resolution,
        fetchMostRecentBeforeEnd: true,
      }),
      new Date(0, 0, 0),
      endDate,
    ];

    // call onSuccess for each entry in the batch
    expect(onSuccess).toBeCalledTimes(1);
    expect(onSuccess.mock.calls).toEqual([onSuccessParams1]);
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

    const requestInformations = [
      {
        id: toId({ assetId, propertyId }),
        start: startDate,
        end: endDate,
        resolution,
        fetchFromStartToEnd: true,
        aggregationType: AGGREGATE_TYPE,
      },
    ];

    await client.getAggregatedPropertyDataPoints({ requestInformations, onSuccess, onError });

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
      .mockResolvedValueOnce({ ...BATCH_ASSET_PROPERTY_AGGREGATES, nextToken: 'nextToken' })
      .mockResolvedValue({ ...BATCH_ASSET_PROPERTY_AGGREGATES });
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

    const requestInformation1 = {
      id: toId({ assetId: assetId1, propertyId: propertyId1 }),
      start: startDate,
      end: endDate,
      resolution,
      fetchFromStartToEnd: true,
      aggregationType: AGGREGATE_TYPE,
    };

    const requestInformation2 = {
      id: toId({ assetId: assetId2, propertyId: propertyId2 }),
      start: startDate,
      end: endDate,
      resolution,
      fetchFromStartToEnd: true,
      aggregationType: AGGREGATE_TYPE,
    };

    // batches requests that are sent on a single frame
    client.getAggregatedPropertyDataPoints({
      requestInformations: [requestInformation1],
      onSuccess,
      onError,
    });
    client.getAggregatedPropertyDataPoints({
      requestInformations: [requestInformation2],
      onSuccess,
      onError,
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
          data: [
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
          aggregationType: AggregateType.AVERAGE,
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
          aggregationType: AggregateType.AVERAGE,
          data: [
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

  it('requests data by property alias', async () => {
    const batchGetAssetPropertyAggregates = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_AGGREGATES);

    const propertyAlias = 'some/property/alias';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ batchGetAssetPropertyAggregates }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);
    const resolution = '1h';

    const requestInformation1 = {
      id: toId({ propertyAlias }),
      start: startDate,
      end: endDate,
      resolution,
      fetchFromStartToEnd: true,
      aggregationType: AGGREGATE_TYPE,
    };

    // batches requests that are sent on a single frame
    client.getAggregatedPropertyDataPoints({
      requestInformations: [requestInformation1],
      onSuccess,
      onError,
    });

    await flushPromises();

    // process the batch and paginate once
    const batchHistoryParams = [
      expect.objectContaining({
        entries: expect.arrayContaining([
          expect.objectContaining({
            propertyAlias,
            startDate,
            endDate,
          }),
        ]),
      }),
    ];

    expect(batchGetAssetPropertyAggregates.mock.calls).toEqual([batchHistoryParams]);

    expect(onError).not.toBeCalled();

    const onSuccessParams1 = [
      expect.arrayContaining([
        expect.objectContaining({
          id: toId({ propertyAlias }),
          aggregationType: AggregateType.AVERAGE,
          data: [
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
          resolution: HOUR_IN_MS,
        }),
      ]),
      expect.objectContaining({
        id: toId({ propertyAlias }),
        start: startDate,
        end: endDate,
        resolution,
        fetchFromStartToEnd: true,
      }),
      startDate,
      endDate,
    ];

    expect(onSuccess.mock.calls).toEqual([onSuccessParams1]);
  });
});

describe('batch duration', () => {
  beforeAll(() => {
    jest.useFakeTimers();
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

describe('batch deduplication', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('deduplicates duplicate requests', async () => {
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

    // queue two requests in the same batch
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

    // clear promise queue
    await flushPromises();

    // ensure latest requests are enqueued
    jest.advanceTimersByTime(0);

    // process the batch
    expect(batchGetAssetPropertyValue).toBeCalledTimes(1);

    // assert batch only had one entry
    expect(batchGetAssetPropertyValue).toBeCalledWith({
      entries: [{ assetId: 'some-asset-id', entryId: '0-0', propertyId: 'some-property-id' }],
      nextToken: undefined,
    });
  });

  it('does not deduplicate non-duplicate requests', async () => {
    const batchGetAssetPropertyValue = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_DOUBLE_VALUE);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ batchGetAssetPropertyValue }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);
    const resolution = '0';

    // queue two requests in the same batch
    client.getLatestPropertyDataPoint({
      requestInformations: [
        {
          id: toId({ assetId: '1', propertyId: '1' }),
          start: startDate,
          end: endDate,
          resolution,
          fetchMostRecentBeforeEnd: true,
        },
      ],
      onSuccess,
      onError,
    });

    client.getLatestPropertyDataPoint({
      requestInformations: [
        {
          id: toId({ assetId: '2', propertyId: '2' }),
          start: startDate,
          end: endDate,
          resolution,
          fetchMostRecentBeforeEnd: true,
        },
      ],
      onSuccess,
      onError,
    });

    // clear promise queue
    await flushPromises();

    // ensure latest requests are enqueued
    jest.advanceTimersByTime(0);

    // process the batch
    expect(batchGetAssetPropertyValue).toBeCalledTimes(1);

    // assert batch only had both entries
    expect(batchGetAssetPropertyValue).toBeCalledWith({
      entries: [
        { assetId: '1', entryId: '0-0', propertyId: '1' },
        { assetId: '2', entryId: '0-1', propertyId: '2' },
      ],
      nextToken: undefined,
    });
  });
});
