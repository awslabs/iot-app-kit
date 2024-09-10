import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';

export const describeAssetMock = jest.fn();
export const describeAssetModelMock = jest.fn();
export const iotSiteWiseClientMock = {
  describeAsset: describeAssetMock,
  describeAssetModel: describeAssetModelMock,
} as unknown as IoTSiteWise;
