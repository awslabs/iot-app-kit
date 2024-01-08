import { fetchAssetModelsFromQuery } from './fetchAssetModelsFromQuery';
import {
  ALARM_ASSET_ID,
  ALARM_LIST_ASSET_MODEL_PROP_RESPONSE,
  ALARM_LIST_ASSET_PROP_RESPONSE,
  ALARM_STATE_PROPERTY_ID,
  ASSET_MODEL_WITH_ALARM,
} from '../../__mocks__';
import { getAssetModule } from './fetchAssetModelsFromQuery.spec';

it('correctly parses query and yields asset models', async () => {
  const describeAsset = jest.fn().mockResolvedValue({
    id: ALARM_ASSET_ID,
    assetModelId: ASSET_MODEL_WITH_ALARM.assetModelId,
  });
  const describeAssetModel = jest
    .fn()
    .mockResolvedValue(ASSET_MODEL_WITH_ALARM);
  const listAssetProperties = jest
    .fn()
    .mockResolvedValue(ALARM_LIST_ASSET_PROP_RESPONSE);
  const listAssetModelProperties = jest
    .fn()
    .mockResolvedValue(ALARM_LIST_ASSET_MODEL_PROP_RESPONSE);

  const { assetModule } = getAssetModule({
    siteWiseApiOverride: {
      describeAsset,
      describeAssetModel,
      listAssetProperties,
      listAssetModelProperties,
    },
  });
  const assetModuleSession = assetModule.startSession();

  const assetModels = fetchAssetModelsFromQuery({
    queries: [
      {
        assets: [
          {
            assetId: ALARM_ASSET_ID,
            properties: [{ propertyId: ALARM_STATE_PROPERTY_ID }],
          },
        ],
      },
    ],
    assetModuleSession,
  });

  const x = await assetModels.next();
  // console.log(x.value.assetModelProperties);
  expect(x).toEqual(
    expect.objectContaining({
      value: {
        assetModels: {
          'alarm-asset-id': ASSET_MODEL_WITH_ALARM,
        },
      },
    })
  );
});
