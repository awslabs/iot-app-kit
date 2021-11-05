import { SiteWiseClient } from './client';
import { createSiteWiseSDK } from '../../../common/tests/util';
import {
  ASSET_PROPERTY_DOUBLE_VALUE,
  ASSET_PROPERTY_VALUE_HISTORY,
} from '../../../common/tests/mocks/assetPropertyValue';
import { SiteWiseDataStreamQuery } from '../types.d';
import { toDataStreamId } from '../util/dataStreamId';
import { SITEWISE_DATA_SOURCE } from '../data-source';

it('initializes', () => {
  expect(() => new SiteWiseClient(createSiteWiseSDK({}))).not.toThrowError();
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
      assets: [{ assetId, propertyIds: [propertyId] }],
    };

    const client = new SiteWiseClient(createSiteWiseSDK({ getAssetPropertyValueHistory }));

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
      assets: [{ assetId, propertyIds: [propertyId] }],
    };

    const client = new SiteWiseClient(createSiteWiseSDK({ getAssetPropertyValueHistory }));

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
      assets: [{ assetId, propertyIds: [propertyId] }],
    };

    const client = new SiteWiseClient(createSiteWiseSDK({ getAssetPropertyValue }));

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

    const client = new SiteWiseClient(createSiteWiseSDK({ getAssetPropertyValue }));

    const onSuccess = jest.fn();
    const onError = jest.fn();
    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [{ assetId, propertyIds: [propertyId] }],
    };

    await client.getLatestPropertyDataPoint({ query, onSuccess, onError });

    expect(onSuccess).not.toBeCalled();
    expect(onError).toBeCalled();
  });
});
