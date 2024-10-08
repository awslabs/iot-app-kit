import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';

export const describeAssetMock = jest.fn();
export const describeAssetModelMock = jest.fn();
export const batchGetAssetPropertyValueMock = jest.fn();
export const iotSiteWiseClientMock = {
  describeAsset: describeAssetMock,
  describeAssetModel: describeAssetModelMock,
  batchGetAssetPropertyValue: batchGetAssetPropertyValueMock,
} as unknown as IoTSiteWise;
