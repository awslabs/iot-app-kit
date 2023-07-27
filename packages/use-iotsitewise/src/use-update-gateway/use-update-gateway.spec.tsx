import { type UpdateGatewayCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook } from '@testing-library/react';

import { useUpdateGateway } from './use-update-gateway';
import { queryClient, wrapper } from '../helpers/test';

const updateGatewayOutputStub: UpdateGatewayCommandOutput = {
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(updateGatewayOutputStub),
} as unknown as IoTSiteWiseClient;

describe('useUpdateGateway', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    const { result } = renderHook(() => useUpdateGateway({ client: mockClient }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ gatewayName: 'GATEWAY TEST STUB', gatewayId: '123' });

    expect(mockClient.send).toHaveBeenCalled();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useUpdateGateway({ client: mockClient, options: {} }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ gatewayName: 'GATEWAY TEST STUB', gatewayId: '123' });

    expect(mockClient.send).toHaveBeenCalled();
  });
});
