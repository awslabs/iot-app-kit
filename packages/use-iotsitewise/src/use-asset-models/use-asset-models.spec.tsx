import { type ListAssetModelsCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook, waitFor } from '@testing-library/react';

import { useAssetModels } from './index';
import { iotSiteWiseKeys } from '../cache';
import { queryClient, wrapper } from '../helpers/test';

const listAssetModelsOutputStub: ListAssetModelsCommandOutput = {
  assetModelSummaries: [
    {
      id: '123',
      name: 'AssetModel Description Test Stub',
      description: 'AssetModel Description Test Stub Description',
      arn: 'arn:${Partition}:iotsitewise:${Region}:${Account}:assetModel/${AssetModelId}',
      creationDate: new Date(0),
      lastUpdateDate: new Date(0),
      status: {
        state: 'ACTIVE',
      },
    },
  ],
  nextToken: 'xyz',
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(listAssetModelsOutputStub),
} as unknown as IoTSiteWiseClient;

describe('useAssetModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    expect(mockClient.send).not.toHaveBeenCalled();
    const { result } = renderHook(() => useAssetModels({ client: mockClient, input: {} }), { wrapper });

    expect(result.current.status).toBe('loading');
    expect(mockClient.send).toHaveBeenCalled();
    expect(result.current.data).toBe(undefined);

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data?.pages[0]).toEqual(listAssetModelsOutputStub);
  });

  it('passes an abort signal to the client', () => {
    renderHook(() => useAssetModels({ client: mockClient, input: {} }), {
      wrapper,
    });
    expect(mockClient.send).toHaveBeenCalledWith(expect.anything(), {
      abortSignal: expect.objectContaining({ aborted: false }),
    });
  });

  it('does not send a request when input is not defined', async () => {
    const { result } = renderHook(() => useAssetModels({ client: mockClient }), { wrapper });
    expect(mockClient.send).not.toHaveBeenCalled();
    expect(result.current.status).toBe('loading');
    const assetModels = queryClient.getQueryData(iotSiteWiseKeys.assetModels());

    expect(assetModels).toEqual(undefined);
  });

  it('caches data accessibly', async () => {
    const { result } = renderHook(() => useAssetModels({ client: mockClient, input: {} }), {
      wrapper,
    });

    const queryCache = queryClient.getQueryCache();

    expect(queryCache.find(iotSiteWiseKeys.assetModelSummaryList({}))?.state.data).toBeUndefined();

    await waitFor(() => expect(result.current.status).toBe('success'));

    const { pages = [] } = queryCache.find(iotSiteWiseKeys.assetModelSummaryList({}))?.state.data as { pages: unknown[] };

    expect(pages[0]).toEqual(listAssetModelsOutputStub);
  });

  it('returns cached data with multiple instantiations of the same query', async () => {
    const { result: resultA } = renderHook(() => useAssetModels({ client: mockClient, input: {} }), {
      wrapper,
    });
    const { result: resultB } = renderHook(() => useAssetModels({ client: mockClient, input: {} }), {
      wrapper,
    });

    await waitFor(() => expect(resultA.current.status).toBe('success'));
    await waitFor(() => expect(resultB.current.status).toBe('success'));

    expect(mockClient.send).toHaveBeenCalledOnce();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useAssetModels({ client: mockClient, input: {}, options: {} }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.status).toBe('success'));
  });

  it('supports pagination', async () => {
    const { result } = renderHook(() => useAssetModels({ client: mockClient, input: {} }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(mockClient.send).toHaveBeenCalledTimes(1);

    await result.current.fetchNextPage();
    expect(mockClient.send).toHaveBeenCalledTimes(2);

    await result.current.fetchNextPage();
    expect(mockClient.send).toHaveBeenCalledTimes(3);
  });
});
