import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { BATCH_ASSET_PROPERTY_AGGREGATES } from '../../__mocks__/assetPropertyValue';
import { toId } from '../util/dataStreamId';
import flushPromises from 'flush-promises';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';
import { batchGetAggregatedPropertyDataPoints } from './batchGetAggregatedPropertyDataPoints';
import { MAX_AGGREGATED_DATA_POINTS } from './constants';

const AGGREGATE_TYPE = AggregateType.AVERAGE;

const assetId1 = 'some-asset-id-1';
const propertyId1 = 'some-property-id-1';

const startDate = new Date(2000, 0, 0);
const endDate = new Date(2001, 0, 0);
const oldestDate = new Date(0, 0, 0);
const resolution = '1h';

const requestInformationCommon = {
  id: toId({ assetId: assetId1, propertyId: propertyId1 }),
  start: startDate,
  end: endDate,
  resolution,
  aggregationType: AGGREGATE_TYPE,
};

const requestEntry = {
  assetId: assetId1,
  propertyId: propertyId1,
  aggregateTypes: [AGGREGATE_TYPE],
  resolution,
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

describe('batchGetAggregatedPropertyDataPoints', () => {
  it('requests with fetchFromStartToEnd', async () => {
    const batchGetAssetPropertyAggregates = jest
      .fn()
      .mockResolvedValue({ ...BATCH_ASSET_PROPERTY_AGGREGATES });

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = createMockSiteWiseSDK({ batchGetAssetPropertyAggregates });

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

    batchGetAggregatedPropertyDataPoints({
      params: [param],
      client,
    });

    await flushPromises();

    expect(batchGetAssetPropertyAggregates).toBeCalledTimes(1);
    expect(batchGetAssetPropertyAggregates).toHaveBeenCalledWith(
      batchParamForStartToEnd
    );
  });

  it('requests with fetchMostRecentBeforeStart', async () => {
    const batchGetAssetPropertyAggregates = jest
      .fn()
      .mockResolvedValue({ ...BATCH_ASSET_PROPERTY_AGGREGATES });

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = createMockSiteWiseSDK({ batchGetAssetPropertyAggregates });

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

    batchGetAggregatedPropertyDataPoints({
      params: [param],
      client,
    });

    await flushPromises();

    expect(batchGetAssetPropertyAggregates).toBeCalledTimes(1);
    expect(batchGetAssetPropertyAggregates).toHaveBeenCalledWith(
      batchParamForMostRecentBeforeStart
    );
  });

  it('requests with fetchMostRecentBeforeEnd', async () => {
    const batchGetAssetPropertyAggregates = jest
      .fn()
      .mockResolvedValue({ ...BATCH_ASSET_PROPERTY_AGGREGATES });

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = createMockSiteWiseSDK({ batchGetAssetPropertyAggregates });

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

    batchGetAggregatedPropertyDataPoints({
      params: [param],
      client,
    });

    await flushPromises();

    expect(batchGetAssetPropertyAggregates).toBeCalledTimes(1);
    expect(batchGetAssetPropertyAggregates).toHaveBeenCalledWith(
      batchParamForMostRecentBeforeEnd
    );
  });

  it('requests with fetchMostRecentBeforeStart, fetchMostRecentBeforeEnd, and fetchFromStartToEnd', async () => {
    const batchGetAssetPropertyAggregates = jest
      .fn()
      .mockResolvedValue({ ...BATCH_ASSET_PROPERTY_AGGREGATES });

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const client = createMockSiteWiseSDK({ batchGetAssetPropertyAggregates });

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

    batchGetAggregatedPropertyDataPoints({
      params: [param],
      client,
    });

    await flushPromises();

    expect(batchGetAssetPropertyAggregates).toBeCalledTimes(3);
    expect(batchGetAssetPropertyAggregates).toHaveBeenCalledWith(
      batchParamForStartToEnd
    );
    expect(batchGetAssetPropertyAggregates).toHaveBeenCalledWith(
      batchParamForMostRecentBeforeEnd
    );
    expect(batchGetAssetPropertyAggregates).toHaveBeenCalledWith(
      batchParamForMostRecentBeforeStart
    );
  });
});
