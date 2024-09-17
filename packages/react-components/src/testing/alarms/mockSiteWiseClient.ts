import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';

export const describeAssetMock = jest.fn();
export const describeAssetModelMock = jest.fn();
export const batchGetAssetPropertyValueMock = jest.fn();
export const batchGetAssetPropertyValueHistoryMock = jest.fn();
export const iotSiteWiseClientMock = {
  describeAsset: describeAssetMock,
  describeAssetModel: describeAssetModelMock,
  batchGetAssetPropertyValue: batchGetAssetPropertyValueMock,
  batchGetAssetPropertyValueHistory: batchGetAssetPropertyValueHistoryMock,
} as unknown as IoTSiteWise;
