import { type CreateAssetModelCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook } from '@testing-library/react';

import { useCreateAssetModel } from './index';
import { queryClient, wrapper } from '../helpers/test';

const createAssetModelOutputStub: CreateAssetModelCommandOutput = {
  assetModelId: '123',
  assetModelArn: 'arn:${Partition}:iotsitewise:${Region}:${Account}:assetModel/${AssetModelId}',
  assetModelStatus: { state: 'CREATING' },
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(createAssetModelOutputStub),
} as unknown as IoTSiteWiseClient;

describe('useCreateAssetModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    const { result } = renderHook(() => useCreateAssetModel({ client: mockClient }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ assetModelName: 'ASSET MODEL TEST STUB' });

    expect(mockClient.send).toHaveBeenCalled();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useCreateAssetModel({ client: mockClient, options: {} }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ assetModelName: 'ASSET MODEL TEST STUB' });

    expect(mockClient.send).toHaveBeenCalled();
  });
});
