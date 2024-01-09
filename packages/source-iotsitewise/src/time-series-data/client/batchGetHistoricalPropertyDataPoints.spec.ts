import { BATCH_ASSET_PROPERTY_VALUE_HISTORY } from '../../__mocks__/assetPropertyValue';
import { toId } from '../util/dataStreamId';
import flushPromises from 'flush-promises';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';
import { batchGetHistoricalPropertyDataPoints } from './batchGetHistoricalPropertyDataPoints';
import { MAX_AGGREGATED_DATA_POINTS } from './constants';

const assetId1 = 'some-asset-id-1';
const propertyId1 = 'some-property-id-1';

const startDate = new Date(2000, 0, 0);
const endDate = new Date(2001, 0, 0);
const oldestDate = new Date(0, 0, 0);
const resolution = '0';

const requestInformationCommon = {
  id: toId({ assetId: assetId1, propertyId: propertyId1 }),
  start: startDate,
  end: endDate,
  resolution,
};

const requestEntry = {
  assetId: assetId1,
  propertyId: propertyId1,
  startDate,
  endDate,
};

const batchParamForStartToEnd = expect.objectContaining({
  entries: expect.arrayContaining([expect.objectContaining(requestEntry)]),
  maxResults: MAX_AGGREGATED_DATA_POINTS,
});

const requestEntryForMostRecentBeforeStart = expect.objectContaining({
  ...requestEntry,
  startDate: oldestDate,
  endDate: startDate,
});

const batchParamForMostRecentBeforeStart = expect.objectContaining({
  entries: expect.arrayContaining([requestEntryForMostRecentBeforeStart]),
  maxResults: 1,
});

const requestEntryForMostRecentBeforeEnd = expect.objectContaining({
  ...requestEntry,
  startDate: oldestDate,
  endDate,
});

const batchParamForMostRecentBeforeEnd = expect.objectContaining({
  entries: expect.arrayContaining([requestEntryForMostRecentBeforeEnd]),
  maxResults: 1,
});

describe('batchGetHistoricalPropertyDataPoints', () => {
  it('requests with fetchFromStartToEnd', async () => {
    const batchGetAssetPropertyValueHistory = jest
      .fn()
      .mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = createMockSiteWiseSDK({ batchGetAssetPropertyValueHistory });

    // Set fetchFromStartToEnd
    const requestInformation = {
      ...requestInformationCommon,
      fetchFromStartToEnd: true,
    };
    const param = {
      requestInformations: [requestInformation],
      onSuccess,
      onError,
      maxResults: MAX_AGGREGATED_DATA_POINTS,
    };

    batchGetHistoricalPropertyDataPoints({
      params: [param],
      client,
    });

    await flushPromises();

    expect(batchGetAssetPropertyValueHistory).toBeCalledTimes(1);
    expect(batchGetAssetPropertyValueHistory).toHaveBeenCalledWith(
      batchParamForStartToEnd
    );
  });

  it('requests with fetchMostRecentBeforeStart', async () => {
    const batchGetAssetPropertyValueHistory = jest
      .fn()
      .mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = createMockSiteWiseSDK({ batchGetAssetPropertyValueHistory });

    // Set fetchMostRecentBeforeStart
    const requestInformation = {
      ...requestInformationCommon,
      fetchMostRecentBeforeStart: true,
    };
    const param = {
      requestInformations: [requestInformation],
      onSuccess,
      onError,
      maxResults: MAX_AGGREGATED_DATA_POINTS,
    };

    batchGetHistoricalPropertyDataPoints({
      params: [param],
      client,
    });

    await flushPromises();

    expect(batchGetAssetPropertyValueHistory).toBeCalledTimes(1);
    expect(batchGetAssetPropertyValueHistory).toHaveBeenCalledWith(
      batchParamForMostRecentBeforeStart
    );
  });

  it('requests with fetchMostRecentBeforeEnd', async () => {
    const batchGetAssetPropertyValueHistory = jest
      .fn()
      .mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = createMockSiteWiseSDK({ batchGetAssetPropertyValueHistory });

    // Set fetchMostRecentBeforeEnd
    const requestInformation = {
      ...requestInformationCommon,
      fetchMostRecentBeforeEnd: true,
    };
    const param = {
      requestInformations: [requestInformation],
      onSuccess,
      onError,
      maxResults: MAX_AGGREGATED_DATA_POINTS,
    };

    batchGetHistoricalPropertyDataPoints({
      params: [param],
      client,
    });

    await flushPromises();

    expect(batchGetAssetPropertyValueHistory).toBeCalledTimes(1);
    expect(batchGetAssetPropertyValueHistory).toHaveBeenCalledWith(
      batchParamForMostRecentBeforeEnd
    );
  });

  it('requests with fetchMostRecentBeforeStart, fetchMostRecentBeforeEnd, and fetchFromStartToEnd', async () => {
    const batchGetAssetPropertyValueHistory = jest
      .fn()
      .mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = createMockSiteWiseSDK({ batchGetAssetPropertyValueHistory });

    // set fetchMostRecentBeforeStart, fetchMostRecentBeforeEnd, and fetchFromStartToEnd
    const requestInformation = {
      ...requestInformationCommon,
      fetchMostRecentBeforeStart: true,
      fetchMostRecentBeforeEnd: true,
      fetchFromStartToEnd: true,
    };
    const param = {
      requestInformations: [requestInformation],
      onSuccess,
      onError,
      maxResults: MAX_AGGREGATED_DATA_POINTS,
    };

    batchGetHistoricalPropertyDataPoints({
      params: [param],
      client,
    });

    await flushPromises();

    expect(batchGetAssetPropertyValueHistory).toBeCalledTimes(3);
    expect(batchGetAssetPropertyValueHistory).toHaveBeenCalledWith(
      batchParamForStartToEnd
    );
    expect(batchGetAssetPropertyValueHistory).toHaveBeenCalledWith(
      batchParamForMostRecentBeforeEnd
    );
    expect(batchGetAssetPropertyValueHistory).toHaveBeenCalledWith(
      batchParamForMostRecentBeforeStart
    );
  });
});
