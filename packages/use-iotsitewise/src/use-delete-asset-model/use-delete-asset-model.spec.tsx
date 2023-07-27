import { type DeleteAssetModelCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook } from '@testing-library/react';

import { useDeleteAssetModel } from './index';
import { queryClient, wrapper } from '../helpers/test';

const deleteAssetModelOutputStub: DeleteAssetModelCommandOutput = {
  assetModelStatus: { state: 'DELETING' },
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(deleteAssetModelOutputStub),
} as unknown as IoTSiteWiseClient;

describe('useDeleteAssetModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    const { result } = renderHook(() => useDeleteAssetModel({ client: mockClient }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ assetModelId: '123' });

    expect(mockClient.send).toHaveBeenCalled();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useDeleteAssetModel({ client: mockClient, options: {} }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ assetModelId: '123' });

    expect(mockClient.send).toHaveBeenCalled();
  });
});
