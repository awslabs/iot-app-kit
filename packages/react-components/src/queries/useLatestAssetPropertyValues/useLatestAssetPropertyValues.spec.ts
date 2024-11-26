import {
  type BatchGetAssetPropertyValueResponse,
  type GetAssetPropertyValueResponse,
  type IoTSiteWise,
} from '@aws-sdk/client-iotsitewise';
import { renderHook, waitFor } from '@testing-library/react';
import merge from 'lodash-es/merge';
import { queryClient } from '../queryClient';
import { useLatestAssetPropertyValues } from './useLatestAssetPropertyValues';

const MOCK_ASSET_ID_1 = 'asset-1';

const MOCK_PROPERTY_ID_1 = 'property-1';

const createMockAssetPropertyValueResponse = (
  response: Partial<GetAssetPropertyValueResponse> = {}
) =>
  merge(
    {},
    {
      propertyValue: {
        value: {
          doubleValue: 10,
        },
        timestamp: {
          timeInSeconds: 100,
          offsetInNanos: 0,
        },
        quality: 'GOOD',
      },
    },
    response
  );

const createMockBatchAssetPropertyValueResponse = (
  response: Partial<BatchGetAssetPropertyValueResponse> = {}
) =>
  merge(
    {},
    {
      errorEntries: [],
      successEntries: [
        {
          entryId: 'entry-1',
          assetPropertyValue: {
            value: {
              doubleValue: 10,
            },
            timestamp: {
              timeInSeconds: 100,
              offsetInNanos: 0,
            },
            quality: 'GOOD',
          },
        },
      ],
      skippedEntries: [],
    },
    response
  );

const getAssetPropertyValue = vi.fn();
const batchGetAssetPropertyValue = vi.fn();

const iotSiteWiseClientMock = {
  getAssetPropertyValue,
  batchGetAssetPropertyValue,
} as unknown as IoTSiteWise;

const iotSiteWiseClientEdgeMock = {
  getAssetPropertyValue,
} as unknown as IoTSiteWise;

describe('useLatestAssetPropertyValues', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
  });

  it('should prefer using BatchGetAssetPropertyValue in successful queries when calling useLatestAssetPropertyValues', async () => {
    getAssetPropertyValue.mockResolvedValue(
      createMockAssetPropertyValueResponse()
    );
    batchGetAssetPropertyValue.mockResolvedValue(
      createMockBatchAssetPropertyValueResponse()
    );

    const { result: queriesResult } = renderHook(() =>
      useLatestAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [
          { assetId: MOCK_ASSET_ID_1, propertyId: MOCK_PROPERTY_ID_1 },
        ],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));

    expect(getAssetPropertyValue).not.toBeCalled();
    expect(batchGetAssetPropertyValue).toBeCalled();
  });

  it('should batch requests together across multiple hooks', async () => {
    batchGetAssetPropertyValue.mockResolvedValue(
      createMockBatchAssetPropertyValueResponse()
    );

    const { result: queriesResult } = renderHook(() =>
      useLatestAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
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
      useLatestAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
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
    expect(batchGetAssetPropertyValue).toHaveBeenCalledOnce();
  });

  it('should call GetAssetPropertyValue in successful queries when calling useLatestAssetPropertyValues at the edge', async () => {
    getAssetPropertyValue.mockResolvedValue(
      createMockAssetPropertyValueResponse()
    );

    const { result: queriesResult } = renderHook(() =>
      useLatestAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientEdgeMock,
        requests: [
          { assetId: MOCK_ASSET_ID_1, propertyId: MOCK_PROPERTY_ID_1 },
        ],
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isSuccess).toBe(true));

    expect(getAssetPropertyValue).toBeCalled();
  });

  it('does nothing if requests are invalid', async () => {
    batchGetAssetPropertyValue.mockResolvedValue(
      createMockBatchAssetPropertyValueResponse()
    );

    const { result: queriesResult } = renderHook(() =>
      useLatestAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [{ assetId: undefined, propertyId: undefined }],
      })
    );

    await waitFor(() => {
      expect(queriesResult.current[0].fetchStatus).toBe('idle');
      expect(queriesResult.current[0].status).toBe('pending');
      expect(queriesResult.current[0].isLoading).toBe(false);
    });

    expect(batchGetAssetPropertyValue).not.toBeCalled();
  });

  it('does nothing if the client is invalid', async () => {
    batchGetAssetPropertyValue.mockResolvedValue(
      createMockBatchAssetPropertyValueResponse()
    );

    const { result: queriesResult } = renderHook(() =>
      useLatestAssetPropertyValues({
        iotSiteWiseClient: {} as unknown as IoTSiteWise,
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

    expect(batchGetAssetPropertyValue).not.toBeCalled();
  });

  it('handles sdk errors', async () => {
    batchGetAssetPropertyValue.mockImplementation(() => {
      throw new Error('This should fail.');
    });

    const { result: queriesResult } = renderHook(() =>
      useLatestAssetPropertyValues({
        iotSiteWiseClient: iotSiteWiseClientMock,
        requests: [
          { assetId: MOCK_ASSET_ID_1, propertyId: MOCK_PROPERTY_ID_1 },
        ],
        retry: false,
      })
    );

    await waitFor(() => expect(queriesResult.current[0].isError).toBe(true));
  });
});
