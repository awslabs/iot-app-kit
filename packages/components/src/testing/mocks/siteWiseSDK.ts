import {
  createMockSiteWiseSDK,
  createAssetResponse,
  createAssetModelResponse,
  ASSET_PROPERTY_VALUE_HISTORY,
  LIVE_ASSET_PROPERTY_VALUE_HISTORY,
} from '@iot-app-kit/source-iotsitewise';

const PROPERTY_ID = 'some-property-id';
const ASSET_MODEL_ID = 'some-asset-model-id';
const PROPERTY_NAME = 'some-property-name';

const getAssetPropertyValueHistory = jest.fn().mockResolvedValue(ASSET_PROPERTY_VALUE_HISTORY);
const getLiveAssetPropertyValueHistory = jest.fn().mockResolvedValue(LIVE_ASSET_PROPERTY_VALUE_HISTORY);
const describeAsset = jest
  .fn()
  .mockImplementation(({ assetId }) =>
    Promise.resolve(createAssetResponse({ assetId: assetId as string, assetModelId: ASSET_MODEL_ID }))
  );
const describeAssetModel = jest.fn().mockImplementation(({ assetModelId }) =>
  Promise.resolve(
    createAssetModelResponse({
      assetModelId: assetModelId as string,
      propertyId: PROPERTY_ID,
      propertyName: PROPERTY_NAME,
    })
  )
);

export const mockSiteWiseSDK = createMockSiteWiseSDK({
  describeAsset,
  describeAssetModel,
  getAssetPropertyValueHistory,
});

export const mockLiveSiteWiseSDK = createMockSiteWiseSDK({
  describeAsset,
  describeAssetModel,
  getAssetPropertyValueHistory: getLiveAssetPropertyValueHistory,
});
