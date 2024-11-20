import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';

export const describeAssetMock = vi.fn();
export const describeAssetModelMock = vi.fn();
export const batchGetAssetPropertyValueMock = vi.fn();
export const batchGetAssetPropertyValueHistoryMock = vi.fn();
export const iotSiteWiseClientMock = {
  describeAsset: describeAssetMock,
  describeAssetModel: describeAssetModelMock,
  batchGetAssetPropertyValue: batchGetAssetPropertyValueMock,
  batchGetAssetPropertyValueHistory: batchGetAssetPropertyValueHistoryMock,
} as unknown as IoTSiteWise;
