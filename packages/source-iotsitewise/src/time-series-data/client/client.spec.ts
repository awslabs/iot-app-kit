import { AggregateType, ResourceNotFoundException } from '@aws-sdk/client-iotsitewise';
import { SiteWiseClient } from './client';
import { createMockSiteWiseSDK } from '../../__mocks__/iotsitewiseSDK';
import {
  ASSET_PROPERTY_DOUBLE_VALUE,
  ASSET_PROPERTY_VALUE_HISTORY,
  AGGREGATE_VALUES,
} from '../../__mocks__/assetPropertyValue';
import { SiteWiseDataStreamQuery } from '../types';
import { toId } from '../util/dataStreamId';
import { SITEWISE_DATA_SOURCE } from '../data-source';
import { HOUR_IN_MS } from '@iot-app-kit/core';

it('initializes', () => {
  expect(() => new SiteWiseClient(createMockSiteWiseSDK({}))).not.toThrowError();
});

describe('getHistoricalPropertyDataPoints', () => {
  it('calls onError on failure', async () => {
    const ERR: Partial<ResourceNotFoundException> = {
      name: 'ResourceNotFoundException',
      message: 'assetId 1 not found',
      $metadata: {
        httpStatusCode: 404,
      },
    };
    const getAssetPropertyValueHistory = jest.fn().mockRejectedValue(ERR);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ getAssetPropertyValueHistory }));

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
          msg: ERR.message,
          type: ERR.name,
          status: ERR.$metadata?.httpStatusCode,
        },
      })
    );
  });

  it('returns data point on success', async () => {
    const getAssetPropertyValueHistory = jest.fn().mockResolvedValue(ASSET_PROPERTY_VALUE_HISTORY);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = new SiteWiseClient(createMockSiteWiseSDK({ getAssetPropertyValueHistory }));

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

    expect(getAssetPropertyValueHistory).toBeCalledWith(
      expect.objectContaining({ assetId, propertyId, startDate, endDate })
    );

    expect(onError).not.toBeCalled();

    expect(onSuccess).toBeCalledWith(
      [
        expect.objectContaining({
          id: toId({ assetId, propertyId }),
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
      ],
      expect.objectContaining({
        id: toId({ assetId, propertyId }),
        start: startDate,
        end: endDate,
        resolution: '0',
        fetchFromStartToEnd: true,
      }),
      startDate,
      endDate
    );
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
    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [{ assetId, properties: [{ propertyId }] }],
    };

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
