import { type CreateAssetCommandOutput, type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { renderHook } from '@testing-library/react';

import { useCreateAsset } from './index';
import { queryClient, wrapper } from '../helpers/test';

const createAssetOutputStub: CreateAssetCommandOutput = {
  assetId: '123',
  assetArn: 'arn:${Partition}:iotsitewise:${Region}:${Account}:asset/${AssetId}',
  assetStatus: { state: 'CREATING' },
  $metadata: {},
};

const mockClient = {
  send: jest.fn().mockResolvedValue(createAssetOutputStub),
} as unknown as IoTSiteWiseClient;

describe('useCreateAsset', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('sends requests to the AWS SDK correctly', async () => {
    const { result } = renderHook(() => useCreateAsset({ client: mockClient }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ assetName: 'ASSET TEST STUB', assetModelId: '123' });

    expect(mockClient.send).toHaveBeenCalled();
  });

  it('is configurable', async () => {
    const { result } = renderHook(() => useCreateAsset({ client: mockClient, options: {} }), { wrapper });

    expect(mockClient.send).not.toHaveBeenCalled();

    await result.current.mutateAsync({ assetName: 'ASSET TEST STUB', assetModelId: '123' });

    expect(mockClient.send).toHaveBeenCalled();
  });
});
