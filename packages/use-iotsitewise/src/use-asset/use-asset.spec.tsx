import { type DescribeAssetCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook, waitFor } from '@testing-library/react';

import { useAsset } from './use-asset';
import { iotSiteWiseKeys } from '../cache';
import { queryClient, wrapper } from '../helpers/test';

const assetDescriptionStub: DescribeAssetCommandOutput = {
  assetId: '123',
  assetModelId: 'abc',
  assetName: 'Asset Description Test Stub',
  assetArn: 'arn:${Partition}:iotsitewise:${Region}:${Account}:asset/${AssetId}',
  assetCreationDate: new Date(0),
  assetLastUpdateDate: new Date(0),
  assetProperties: [],
  assetHierarchies: [],
  assetStatus: {
    state: 'ACTIVE',
  },
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(assetDescriptionStub),
} as unknown as IoTSiteWiseClient;

describe('useAsset', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    expect(mockClient.send).not.toHaveBeenCalled();
    const { result } = renderHook(
      () => useAsset({ client: mockClient, input: { assetId: assetDescriptionStub.assetId } }),
      { wrapper }
    );

    expect(result.current.status).toBe('loading');
    expect(mockClient.send).toHaveBeenCalled();
    expect(result.current.data).toBe(undefined);

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(assetDescriptionStub);
  });

  it('passes an abort signal to the client', () => {
    renderHook(() => useAsset({ client: mockClient, input: { assetId: assetDescriptionStub.assetId } }), {
      wrapper,
    });
    expect(mockClient.send).toHaveBeenCalledWith(expect.anything(), {
      abortSignal: expect.objectContaining({ aborted: false }),
    });
  });

  it('does not send a request when input is not defined', async () => {
    const { result } = renderHook(() => useAsset({ client: mockClient }), { wrapper });
    expect(mockClient.send).not.toHaveBeenCalled();
    expect(result.current.status).toBe('loading');
    const assets = queryClient.getQueryData(iotSiteWiseKeys.assets());

    expect(assets).toEqual(undefined);
  });

  it('caches data accessibly', async () => {
    const { result } = renderHook(
      () => useAsset({ client: mockClient, input: { assetId: assetDescriptionStub.assetId } }),
      {
        wrapper,
      }
    );

    const queryCache = queryClient.getQueryCache();

    expect(
      queryCache.find(iotSiteWiseKeys.assetDescription({ assetId: assetDescriptionStub.assetId }))?.state.data
    ).toBeUndefined();

    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(queryCache.find(iotSiteWiseKeys.assetDescription({ assetId: assetDescriptionStub.assetId }))?.state.data).toEqual(
      assetDescriptionStub
    );
  });

  it('returns cached data with multiple instantiations of the same query', async () => {
    const { result: resultA } = renderHook(
      () => useAsset({ client: mockClient, input: { assetId: assetDescriptionStub.assetId } }),
      {
        wrapper,
      }
    );
    const { result: resultB } = renderHook(
      () => useAsset({ client: mockClient, input: { assetId: assetDescriptionStub.assetId } }),
      {
        wrapper,
      }
    );

    await waitFor(() => expect(resultA.current.status).toBe('success'));
    await waitFor(() => expect(resultB.current.status).toBe('success'));

    expect(mockClient.send).toHaveBeenCalledOnce();
  });

  it('is configurable', async () => {
    const { result } = renderHook(
      () => useAsset({ client: mockClient, input: { assetId: assetDescriptionStub.assetId }, options: {} }),
      {
        wrapper,
      }
    );

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(assetDescriptionStub);
  });
});
