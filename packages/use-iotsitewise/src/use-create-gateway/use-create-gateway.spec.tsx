import { type CreateGatewayCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook } from '@testing-library/react';

import { useCreateGateway } from './index';
import { queryClient, wrapper } from '../helpers/test';

const createGatewayOutputStub: CreateGatewayCommandOutput = {
  gatewayId: '123',
  gatewayArn: 'arn:${Partition}:iotsitewise:${Region}:${Account}:gateway/${GatewayId}',
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(createGatewayOutputStub),
} as unknown as IoTSiteWiseClient;

describe('useCreateGateway', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    const { result } = renderHook(() => useCreateGateway({ client: mockClient }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ gatewayName: 'CREATE GATEWAY TEST STUB', gatewayPlatform: undefined });

    expect(mockClient.send).toHaveBeenCalled();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useCreateGateway({ client: mockClient, options: {} }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ gatewayName: 'CREATE GATEWAY TEST STUB', gatewayPlatform: undefined });

    expect(mockClient.send).toHaveBeenCalled();
  });
});
