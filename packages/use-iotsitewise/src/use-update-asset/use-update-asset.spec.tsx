import { type UpdateAssetCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook } from '@testing-library/react';

import { useUpdateAsset } from './use-update-asset';
import { queryClient, wrapper } from '../helpers/test';

const updateAssetOutputStub: UpdateAssetCommandOutput = {
  assetStatus: { state: 'UPDATING' },
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(updateAssetOutputStub),
} as unknown as IoTSiteWiseClient;

describe('useUpdateAsset', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    const { result } = renderHook(() => useUpdateAsset({ client: mockClient }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ assetId: '123', assetName: 'new asset name' });

    expect(mockClient.send).toHaveBeenCalled();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useUpdateAsset({ client: mockClient, options: {} }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ assetId: '123', assetName: 'new asset name' });

    expect(mockClient.send).toHaveBeenCalled();
  });
});
