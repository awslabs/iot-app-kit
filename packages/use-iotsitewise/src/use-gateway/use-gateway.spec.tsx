import { type DescribeGatewayCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook, waitFor } from '@testing-library/react';

import { useGateway } from './index';
import { iotSiteWiseKeys } from '../cache';
import { queryClient, wrapper } from '../helpers/test';

const gatewayDescriptionStub: DescribeGatewayCommandOutput = {
  gatewayId: '123',
  gatewayName: 'Gateway Description Test Stub',
  gatewayArn: 'arn:${Partition}:iotsitewise:${Region}:${Account}:gateway/${GatewayId}',
  gatewayCapabilitySummaries: [],
  creationDate: new Date(0),
  lastUpdateDate: new Date(0),
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(gatewayDescriptionStub),
} as unknown as IoTSiteWiseClient;

describe('useGateway', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    expect(mockClient.send).not.toHaveBeenCalled();
    const { result } = renderHook(
      () => useGateway({ client: mockClient, input: { gatewayId: gatewayDescriptionStub.gatewayId } }),
      { wrapper }
    );

    expect(result.current.status).toBe('loading');
    expect(mockClient.send).toHaveBeenCalled();
    expect(result.current.data).toBe(undefined);

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(gatewayDescriptionStub);
  });

  it('passes an abort signal to the client', () => {
    renderHook(() => useGateway({ client: mockClient, input: { gatewayId: gatewayDescriptionStub.gatewayId } }), {
      wrapper,
    });
    expect(mockClient.send).toHaveBeenCalledWith(expect.anything(), {
      abortSignal: expect.objectContaining({ aborted: false }),
    });
  });

  it('does not send a request when input is not defined', async () => {
    const { result } = renderHook(() => useGateway({ client: mockClient }), { wrapper });
    expect(mockClient.send).not.toHaveBeenCalled();
    expect(result.current.status).toBe('loading');
    const gateways = queryClient.getQueryData(iotSiteWiseKeys.gateways());

    expect(gateways).toEqual(undefined);
  });

  it('caches data accessibly', async () => {
    const { result } = renderHook(
      () => useGateway({ client: mockClient, input: { gatewayId: gatewayDescriptionStub.gatewayId } }),
      {
        wrapper,
      }
    );

    const queryCache = queryClient.getQueryCache();

    expect(
      queryCache.find(iotSiteWiseKeys.gatewayDescription({ gatewayId: gatewayDescriptionStub.gatewayId }))?.state.data
    ).toBeUndefined();

    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(
      queryCache.find(iotSiteWiseKeys.gatewayDescription({ gatewayId: gatewayDescriptionStub.gatewayId }))?.state.data
    ).toEqual(gatewayDescriptionStub);
  });

  it('returns cached data with multiple instantiations of the same query', async () => {
    const { result: resultA } = renderHook(
      () => useGateway({ client: mockClient, input: { gatewayId: gatewayDescriptionStub.gatewayId } }),
      {
        wrapper,
      }
    );
    const { result: resultB } = renderHook(
      () => useGateway({ client: mockClient, input: { gatewayId: gatewayDescriptionStub.gatewayId } }),
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
      () => useGateway({ client: mockClient, input: { gatewayId: gatewayDescriptionStub.gatewayId }, options: {} }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(gatewayDescriptionStub);
  });
});
