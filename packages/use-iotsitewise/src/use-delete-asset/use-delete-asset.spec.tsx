import { type DeleteAssetCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook } from '@testing-library/react';

import { useDeleteAsset } from './index';
import { queryClient, wrapper } from '../helpers/test';

const deleteAssetOutputStub: DeleteAssetCommandOutput = {
  assetStatus: { state: 'DELETING' },
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(deleteAssetOutputStub),
} as unknown as IoTSiteWiseClient;

describe('useDeleteAsset', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    const { result } = renderHook(() => useDeleteAsset({ client: mockClient }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ assetId: '123' });

    expect(mockClient.send).toHaveBeenCalled();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useDeleteAsset({ client: mockClient, options: {} }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ assetId: '123' });

    expect(mockClient.send).toHaveBeenCalled();
  });
});
