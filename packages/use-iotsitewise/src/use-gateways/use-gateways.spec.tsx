import { type ListGatewaysCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook, waitFor } from '@testing-library/react';

import { useGateways } from './index';
import { iotSiteWiseKeys } from '../cache';
import { queryClient, wrapper } from '../helpers/test';

const listGatewaysOutputStub: ListGatewaysCommandOutput = {
  gatewaySummaries: [
    {
      gatewayId: '123',
      gatewayName: 'Gateway Description Test Stub',
      creationDate: new Date(0),
      lastUpdateDate: new Date(0),
    },
  ],
  nextToken: 'xyz',
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(listGatewaysOutputStub),
} as unknown as IoTSiteWiseClient;

describe('useGateway', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    expect(mockClient.send).not.toHaveBeenCalled();
    const { result } = renderHook(() => useGateways({ client: mockClient, input: {} }), { wrapper });

    expect(result.current.status).toBe('loading');
    expect(mockClient.send).toHaveBeenCalled();
    expect(result.current.data).toBe(undefined);

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data?.pages[0]).toEqual(listGatewaysOutputStub);
  });

  it('passes an abort signal to the client', () => {
    renderHook(() => useGateways({ client: mockClient, input: {} }), {
      wrapper,
    });
    expect(mockClient.send).toHaveBeenCalledWith(expect.anything(), {
      abortSignal: expect.objectContaining({ aborted: false }),
    });
  });

  it('does not send a request when input is not defined', async () => {
    const { result } = renderHook(() => useGateways({ client: mockClient }), { wrapper });
    expect(mockClient.send).not.toHaveBeenCalled();
    expect(result.current.status).toBe('loading');
    const gateways = queryClient.getQueryData(iotSiteWiseKeys.gateways());

    expect(gateways).toEqual(undefined);
  });

  it('caches data accessibly', async () => {
    const { result } = renderHook(() => useGateways({ client: mockClient, input: {} }), {
      wrapper,
    });

    const queryCache = queryClient.getQueryCache();

    expect(queryCache.find(iotSiteWiseKeys.gatewaySummaryList({}))?.state.data).toBeUndefined();

    await waitFor(() => expect(result.current.status).toBe('success'));

    const { pages = [] } = queryCache.find(iotSiteWiseKeys.gatewaySummaryList({}))?.state.data as { pages: unknown[] };

    expect(pages[0]).toEqual(listGatewaysOutputStub);
  });

  it('returns cached data with multiple instantiations of the same query', async () => {
    const { result: resultA } = renderHook(() => useGateways({ client: mockClient, input: {} }), {
      wrapper,
    });
    const { result: resultB } = renderHook(() => useGateways({ client: mockClient, input: {} }), {
      wrapper,
    });

    await waitFor(() => expect(resultA.current.status).toBe('success'));
    await waitFor(() => expect(resultB.current.status).toBe('success'));

    expect(mockClient.send).toHaveBeenCalledOnce();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useGateways({ client: mockClient, input: {}, options: {} }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.status).toBe('success'));
  });

  it('supports pagination', async () => {
    const { result } = renderHook(() => useGateways({ client: mockClient, input: {} }), {
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
