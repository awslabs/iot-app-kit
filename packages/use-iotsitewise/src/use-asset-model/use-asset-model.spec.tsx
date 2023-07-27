import { type DescribeAssetModelCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook, waitFor } from '@testing-library/react';

import { useAssetModel } from './index';
import { iotSiteWiseKeys } from '../cache';
import { queryClient, wrapper } from '../helpers/test';

const assetModelDescriptionStub: DescribeAssetModelCommandOutput = {
  assetModelId: '123',
  assetModelName: 'AssetModel Description Test Stub',
  assetModelDescription: 'AssetModel Description Test Stub Description',
  assetModelArn: 'arn:${Partition}:iotsitewise:${Region}:${Account}:assetModel/${AssetModelId}',
  assetModelCreationDate: new Date(0),
  assetModelLastUpdateDate: new Date(0),
  assetModelProperties: [],
  assetModelHierarchies: [],
  assetModelStatus: {
    state: 'ACTIVE',
  },
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(assetModelDescriptionStub),
} as unknown as IoTSiteWiseClient;

describe('useAssetModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    expect(mockClient.send).not.toHaveBeenCalled();
    const { result } = renderHook(
      () => useAssetModel({ client: mockClient, input: { assetModelId: assetModelDescriptionStub.assetModelId } }),
      { wrapper }
    );

    expect(result.current.status).toBe('loading');
    expect(mockClient.send).toHaveBeenCalled();
    expect(result.current.data).toBe(undefined);

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(assetModelDescriptionStub);
  });

  it('passes an abort signal to the client', () => {
    renderHook(
      () => useAssetModel({ client: mockClient, input: { assetModelId: assetModelDescriptionStub.assetModelId } }),
      {
        wrapper,
      }
    );
    expect(mockClient.send).toHaveBeenCalledWith(expect.anything(), {
      abortSignal: expect.objectContaining({ aborted: false }),
    });
  });

  it('does not send a request when input is not defined', async () => {
    const { result } = renderHook(() => useAssetModel({ client: mockClient }), { wrapper });
    expect(mockClient.send).not.toHaveBeenCalled();
    expect(result.current.status).toBe('loading');
    const assetModels = queryClient.getQueryData(iotSiteWiseKeys.assetModels());

    expect(assetModels).toEqual(undefined);
  });

  it('caches data accessibly', async () => {
    const { result } = renderHook(
      () => useAssetModel({ client: mockClient, input: { assetModelId: assetModelDescriptionStub.assetModelId } }),
      {
        wrapper,
      }
    );

    const queryCache = queryClient.getQueryCache();

    expect(
      queryCache.find(iotSiteWiseKeys.assetModelDescription({ assetModelId: assetModelDescriptionStub.assetModelId }))?.state
        .data
    ).toBeUndefined();

    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(
      queryCache.find(iotSiteWiseKeys.assetModelDescription({ assetModelId: assetModelDescriptionStub.assetModelId }))?.state
        .data
    ).toEqual(assetModelDescriptionStub);
  });

  it('returns cached data with multiple instantiations of the same query', async () => {
    const { result: resultA } = renderHook(
      () => useAssetModel({ client: mockClient, input: { assetModelId: assetModelDescriptionStub.assetModelId } }),
      {
        wrapper,
      }
    );
    const { result: resultB } = renderHook(
      () => useAssetModel({ client: mockClient, input: { assetModelId: assetModelDescriptionStub.assetModelId } }),
      {
        wrapper,
      }
    );

    await waitFor(() => expect(resultA.current.status).toBe('success'));
    await waitFor(() => expect(resultB.current.status).toBe('success'));

    expect(mockClient.send).toHaveBeenCalledOnce();
  });

  it('is configurable', async () => {
    expect(mockClient.send).not.toHaveBeenCalled();
    const { result } = renderHook(
      () =>
        useAssetModel({
          client: mockClient,
          input: { assetModelId: assetModelDescriptionStub.assetModelId },
          options: {},
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(assetModelDescriptionStub);
  });
});
