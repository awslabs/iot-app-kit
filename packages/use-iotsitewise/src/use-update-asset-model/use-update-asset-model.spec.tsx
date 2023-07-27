import { type UpdateAssetModelCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook } from '@testing-library/react';

import { useUpdateAssetModel } from './use-update-asset-model';
import { queryClient, wrapper } from '../helpers/test';

const updateAssetModelOutputStub: UpdateAssetModelCommandOutput = {
  assetModelStatus: { state: 'UPDATING' },
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(updateAssetModelOutputStub),
} as unknown as IoTSiteWiseClient;

describe('useUpdateAssetModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    const { result } = renderHook(() => useUpdateAssetModel({ client: mockClient }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ assetModelName: 'ASSETMODEL TEST STUB', assetModelId: '123' });

    expect(mockClient.send).toHaveBeenCalled();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useUpdateAssetModel({ client: mockClient, options: {} }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ assetModelName: 'ASSETMODEL TEST STUB', assetModelId: '123' });

    expect(mockClient.send).toHaveBeenCalled();
  });
});
