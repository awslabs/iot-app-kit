import { type DeleteGatewayCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook } from '@testing-library/react';

import { useDeleteGateway } from './index';
import { queryClient, wrapper } from '../helpers/test';

const deleteGatewayOutputStub: DeleteGatewayCommandOutput = {
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(deleteGatewayOutputStub),
} as unknown as IoTSiteWiseClient;

describe('useDeleteGateway', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    const { result } = renderHook(() => useDeleteGateway({ client: mockClient }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ gatewayId: '123' });

    expect(mockClient.send).toHaveBeenCalled();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useDeleteGateway({ client: mockClient, options: {} }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ gatewayId: '123' });

    expect(mockClient.send).toHaveBeenCalled();
  });
});
