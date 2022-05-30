import {
  createMockSiteWiseSDK,
  createAssetResponse,
  createAssetModelResponse,
  BATCH_ASSET_PROPERTY_VALUE_HISTORY,
  BATCH_ASSET_PROPERTY_AGGREGATES,
} from '@iot-app-kit/source-iotsitewise';

const PROPERTY_ID = 'some-property-id';
const ASSET_MODEL_ID = 'some-asset-model-id';
const PROPERTY_NAME = 'some-property-name';

const batchGetAssetPropertyValueHistory = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY);
const batchGetAssetPropertyAggregates = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_AGGREGATES);
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
  batchGetAssetPropertyValueHistory,
  batchGetAssetPropertyAggregates,
});
