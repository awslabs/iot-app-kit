import {
  type BatchGetAssetPropertyValueHistoryResponse,
  type GetAssetPropertyValueHistoryResponse,
  type IoTSiteWise,
} from '@aws-sdk/client-iotsitewise';
import { renderHook, waitFor } from '@testing-library/react';
import { queryClient } from '../queryClient';
import { useHistoricalAssetPropertyValues } from './useHistoricalAssetPropertyValues';
import merge from 'lodash.merge';

const MOCK_ASSET_ID_1 = 'asset-1';

const MOCK_PROPERTY_ID_1 = 'property-1';

const MOCK_VIEWPORT = {
  duration: '10m',
};

const createMockAssetPropertyValueHistoryResponse = (
  response: Partial<GetAssetPropertyValueHistoryResponse> = {}
) =>
  merge(
    {},
    {
      assetPropertyValueHistory: [
        {
          value: {
            doubleValue: 10,
          },
          timestamp: {
            timeInSeconds: 100,
            offsetInNanos: 0,
          },
          quality: 'GOOD',
        },
        {
          value: {
            doubleValue: 11,
          },
          timestamp: {
            timeInSeconds: 200,
            offsetInNanos: 0,
          },
          quality: 'GOOD',
        },
      ],
    },
    response
  );

const createMockBatchAssetPropertyValueHistoryResponse = (
  response: Partial<BatchGetAssetPropertyValueHistoryResponse> = {}
) =>
  merge(
    {},
    {
      errorEntries: [],
      successEntries: [
        {
          entryId: 'entry-1',
          assetPropertyValueHistory: [
            {
              value: {
                doubleValue: 10,
              },
              timestamp: {
                timeInSeconds: 100,
                offsetInNanos: 0,
              },
              quality: 'GOOD',
            },
            {
              value: {
                doubleValue: 11,
              },
              timestamp: {
                timeInSeconds: 200,
                offsetInNanos: 0,
              },
              quality: 'GOOD',
            },
          ],
        },
      ],
      skippedEntries: [],
    },
    response
  );

const getAssetPropertyValueHistory = jest.fn();
const batchGetAssetPropertyValueHistory = jest.fn();

const iotSiteWiseClientMock = {
  getAssetPropertyValueHistory,
  batchGetAssetPropertyValueHistory,
} as unknown as IoTSiteWise;

const iotSiteWiseClientEdgeMock = {
  getAssetPropertyValueHistory,
} as unknown as IoTSiteWise;

describe('useHistoricalAssetPropertyValues', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    queryClient.clear();
  });

  it('should prefer using BatchGetAssetPropertyValue in successful queries when calling useHistoricalAssetPropertyValues', async () => {
    getAssetPropertyValueHistory.mockResolvedValue(
      createMockAssetPropertyValueHistoryResponse()
    );
    batchGetAssetPropertyValueHistory.mockResolvedValue(
      createMockBatchAssetPropertyValueHistoryResponse()
    );

    const { result: queriesResult } = renderHook(() =>
      useHistoricalAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: MOCK_VIEWPORT,
        requests: [
          { assetId: MOCK_ASSET_ID_1, propertyId: MOCK_PROPERTY_ID_1 },
        ],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));

    expect(getAssetPropertyValueHistory).not.toBeCalled();
    expect(batchGetAssetPropertyValueHistory).toBeCalled();
  });

  it('should batch requests together across multiple hooks', async () => {
    batchGetAssetPropertyValueHistory.mockResolvedValue(
      createMockBatchAssetPropertyValueHistoryResponse()
    );

    const { result: queriesResult } = renderHook(() =>
      useHistoricalAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: MOCK_VIEWPORT,
        requests: [
          { assetId: 'asset-1', propertyId: 'property-1' },
          { assetId: 'asset-2', propertyId: 'property-2' },
          { assetId: 'asset-3', propertyId: 'property-3' },
          { assetId: 'asset-4', propertyId: 'property-4' },
          { assetId: 'asset-5', propertyId: 'property-5' },
          { assetId: 'asset-6', propertyId: 'property-6' },
        ],
      })
    );

    const { result: queriesResult2 } = renderHook(() =>
      useHistoricalAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: MOCK_VIEWPORT,
        requests: [
          { assetId: 'asset-7', propertyId: 'property-7' },
          { assetId: 'asset-8', propertyId: 'property-8' },
          { assetId: 'asset-9', propertyId: 'property-9' },
          { assetId: 'asset-10', propertyId: 'property-10' },
          { assetId: 'asset-11', propertyId: 'property-11' },
          { assetId: 'asset-12', propertyId: 'property-12' },
        ],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));
    await waitFor(() => expect(queriesResult2.current[0].isSuccess).toBe(true));

    expect(queriesResult.current.length).toBe(6);
    expect(queriesResult2.current.length).toBe(6);
    expect(batchGetAssetPropertyValueHistory).toHaveBeenCalledOnce();
  });

  it('should call GetAssetPropertyValue in successful queries when calling useHistoricalAssetPropertyValues at the edge', async () => {
    getAssetPropertyValueHistory.mockResolvedValue(
      createMockAssetPropertyValueHistoryResponse()
    );

    const { result: queriesResult } = renderHook(() =>
      useHistoricalAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientEdgeMock,
        viewport: MOCK_VIEWPORT,
        requests: [
          { assetId: MOCK_ASSET_ID_1, propertyId: MOCK_PROPERTY_ID_1 },
        ],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));

    expect(getAssetPropertyValueHistory).toBeCalled();
  });

  it('does nothing if requests are invalid', async () => {
    batchGetAssetPropertyValueHistory.mockResolvedValue(
      createMockBatchAssetPropertyValueHistoryResponse()
    );

    const { result: queriesResult } = renderHook(() =>
      useHistoricalAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: MOCK_VIEWPORT,
        requests: [{ assetId: undefined, propertyId: undefined }],
      })
    );

    await waitFor(() => {
      expect(queriesResult.current[0].fetchStatus).toBe('idle');
      expect(queriesResult.current[0].status).toBe('pending');
      expect(queriesResult.current[0].isLoading).toBe(false);
    });

    expect(batchGetAssetPropertyValueHistory).not.toBeCalled();
  });

  it('does nothing if viewport is invalid', async () => {
    batchGetAssetPropertyValueHistory.mockResolvedValue(
      createMockBatchAssetPropertyValueHistoryResponse()
    );

    const { result: queriesResult } = renderHook(() =>
      useHistoricalAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [
          { assetId: MOCK_ASSET_ID_1, propertyId: MOCK_PROPERTY_ID_1 },
        ],
      })
    );

    await waitFor(() => {
      expect(queriesResult.current[0].fetchStatus).toBe('idle');
      expect(queriesResult.current[0].status).toBe('pending');
      expect(queriesResult.current[0].isLoading).toBe(false);
    });

    expect(batchGetAssetPropertyValueHistory).not.toBeCalled();
  });

  it('does nothing if the client is invalid', async () => {
    batchGetAssetPropertyValueHistory.mockResolvedValue(
      createMockBatchAssetPropertyValueHistoryResponse()
    );

    const { result: queriesResult } = renderHook(() =>
      useHistoricalAssetPropertyValues({
        iotSiteWiseClient: {} as unknown as IoTSiteWise,
        viewport: MOCK_VIEWPORT,
        requests: [
          { assetId: MOCK_ASSET_ID_1, propertyId: MOCK_PROPERTY_ID_1 },
        ],
      })
    );

    await waitFor(() => {
      expect(queriesResult.current[0].fetchStatus).toBe('idle');
      expect(queriesResult.current[0].status).toBe('pending');
      expect(queriesResult.current[0].isLoading).toBe(false);
    });

    expect(batchGetAssetPropertyValueHistory).not.toBeCalled();
  });

  it('handles sdk errors', async () => {
    batchGetAssetPropertyValueHistory.mockImplementation(() => {
      throw new Error('This should fail.');
    });

    const { result: queriesResult } = renderHook(() =>
      useHistoricalAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        viewport: MOCK_VIEWPORT,
        requests: [
          { assetId: MOCK_ASSET_ID_1, propertyId: MOCK_PROPERTY_ID_1 },
        ],
        retry: false,
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isError).toBe(true));
  });
});
