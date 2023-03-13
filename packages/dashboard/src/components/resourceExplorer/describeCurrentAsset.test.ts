import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { describeCurrentAsset, blank } from './describeCurrentAsset';
import { HIERARCHY_ROOT_ID } from './nextResourceExplorer';
import type { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';

const fakeAssetId = 'fake-asset-id';

const client = {
  send: () => ({ assetId: fakeAssetId } as DescribeAssetResponse),
} as unknown as IoTSiteWiseClient;

const response = JSON.parse(JSON.stringify(blank)); // Copy blank
response.assetId = fakeAssetId;

describe('describeCurrentAsset', () => {
  it('returns a blank asset if client is undefined', async () => {
    const result = await describeCurrentAsset(HIERARCHY_ROOT_ID, undefined);
    expect(result).toEqual(blank);
  });

  it('returns a blank asset if currentBranchId is HIERARCHY_ROOT_ID', async () => {
    const result = await describeCurrentAsset(HIERARCHY_ROOT_ID, client);
    expect(result).toEqual(blank);
  });

  it('returns a blank asset on error', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    client.send = jest.fn().mockImplementation(() => {
      throw new Error('Error');
    });
    const result = await describeCurrentAsset(fakeAssetId, client);
    expect(result).toEqual(blank);
  });

  it('returns the response from describeAsset', async () => {
    const result = await describeCurrentAsset(fakeAssetId, client);
    expect(result).toEqual(blank as DescribeAssetResponse);
  });
});
