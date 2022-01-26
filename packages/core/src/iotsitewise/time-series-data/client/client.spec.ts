import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { SiteWiseClient } from './client';
import { createMockSiteWiseSDK } from '../../../common/tests/util';
import {
  ASSET_PROPERTY_DOUBLE_VALUE,
  ASSET_PROPERTY_VALUE_HISTORY,
  AGGREGATE_VALUES,
} from '../../../common/tests/mocks/assetPropertyValue';
import { SiteWiseDataStreamQuery } from '../types';
import { toDataStreamId } from '../util/dataStreamId';
import { SITEWISE_DATA_SOURCE } from '../data-source';
import { HOUR_IN_MS } from '../../../common/time';

it('initializes', () => {
  expect(() => new SiteWiseClient(createMockSiteWiseSDK({}))).not.toThrowError();
});

describe('getHistoricalPropertyDataPoints', () => {
  it('calls onError on failure', async () => {
    const ERR = new Error('some error');
    const getAssetPropertyValueHistory = jest.fn().mockRejectedValue(ERR);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();
    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [{ assetId, properties: [{ propertyId }] }],
    };

    const client = new SiteWiseClient(createMockSiteWiseSDK({ getAssetPropertyValueHistory }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);

    await client.getHistoricalPropertyDataPoints({ query, onSuccess, onError, start: startDate, end: endDate });

    expect(onError).toBeCalled();
  });

  it('returns data point on success', async () => {
    const getAssetPropertyValueHistory = jest.fn().mockResolvedValue(ASSET_PROPERTY_VALUE_HISTORY);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();
    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [{ assetId, properties: [{ propertyId }] }],
    };

    const client = new SiteWiseClient(createMockSiteWiseSDK({ getAssetPropertyValueHistory }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);

    await client.getHistoricalPropertyDataPoints({ query, onSuccess, onError, start: startDate, end: endDate });

    expect(getAssetPropertyValueHistory).toBeCalledWith(
      expect.objectContaining({ assetId, propertyId, startDate, endDate })
    );

    expect(onError).not.toBeCalled();

    expect(onSuccess).toBeCalledWith([
      expect.objectContaining({
        id: toDataStreamId({ assetId, propertyId }),
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
    ]);
  });
});

describe('getLatestPropertyDataPoint', () => {
  it('returns data point on success', async () => {
    const getAssetPropertyValue = jest.fn().mockResolvedValue(ASSET_PROPERTY_DOUBLE_VALUE);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();
    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [{ assetId, properties: [{ propertyId }] }],
    };

    const client = new SiteWiseClient(createMockSiteWiseSDK({ getAssetPropertyValue }));

    await client.getLatestPropertyDataPoint({ query, onSuccess, onError });
    expect(getAssetPropertyValue).toBeCalledWith({ assetId, propertyId });

    expect(onError).not.toBeCalled();

    expect(onSuccess).toBeCalledWith([
      expect.objectContaining({
        id: toDataStreamId({ assetId, propertyId }),
        data: [
          {
            y: ASSET_PROPERTY_DOUBLE_VALUE.propertyValue?.value?.doubleValue,
            x: 1000099,
          },
        ],
      }),
    ]);
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

    await client.getLatestPropertyDataPoint({ query, onSuccess, onError });

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
    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [{ assetId, properties: [{ propertyId }] }],
    };

    const client = new SiteWiseClient(createMockSiteWiseSDK({ getAssetPropertyAggregates }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);
    const resolution = '1h';
    const aggregateTypes = [AggregateType.AVERAGE];

    await client.getAggregatedPropertyDataPoints({
      query,
      onSuccess,
      onError,
      start: startDate,
      end: endDate,
      resolution,
      aggregateTypes,
    });

    expect(onError).toBeCalled();
  });

  it('throws error when no resolution specified', async () => {
    const getAssetPropertyAggregates = jest.fn().mockResolvedValue(AGGREGATE_VALUES);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();
    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [{ assetId, properties: [{ propertyId }] }],
    };

    const client = new SiteWiseClient(createMockSiteWiseSDK({ getAssetPropertyAggregates }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);
    const aggregateTypes = [AggregateType.AVERAGE];

    await expect(async () => {
      await client.getAggregatedPropertyDataPoints({
        query,
        onSuccess,
        onError,
        start: startDate,
        end: endDate,
        aggregateTypes,
      });
    }).rejects.toThrowError();
  });

  it('returns data point on success', async () => {
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const onSuccess = jest.fn();
    const onError = jest.fn();
    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [{ assetId, properties: [{ propertyId }] }],
    };
    const getAssetPropertyAggregates = jest.fn().mockResolvedValue(AGGREGATE_VALUES);

    const client = new SiteWiseClient(createMockSiteWiseSDK({ getAssetPropertyAggregates }));

    const startDate = new Date(2000, 0, 0);
    const endDate = new Date(2001, 0, 0);
    const resolution = '1h';
    const aggregateTypes = [AggregateType.AVERAGE];

    await client.getAggregatedPropertyDataPoints({
      query,
      onSuccess,
      onError,
      start: startDate,
      end: endDate,
      resolution,
      aggregateTypes,
    });

    expect(getAssetPropertyAggregates).toBeCalledWith(
      expect.objectContaining({ assetId, propertyId, startDate, endDate, resolution, aggregateTypes })
    );

    expect(onError).not.toBeCalled();

    expect(onSuccess).toBeCalledWith([
      expect.objectContaining({
        id: toDataStreamId({ assetId, propertyId }),
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
    ]);
  });
});
