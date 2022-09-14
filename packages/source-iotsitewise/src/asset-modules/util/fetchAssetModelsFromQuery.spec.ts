import { fetchAssetModelsFromQuery } from './fetchAssetModelsFromQuery';
import {
  ALARM_ASSET_ID,
  ALARM_STATE_PROPERTY_ID,
  ASSET_MODEL_WITH_ALARM,
  createMockSiteWiseSDK,
} from '../../__mocks__';
import { SiteWiseAssetDataSource } from '../sitewise/types';
import { createSiteWiseAssetDataSource } from '../asset-data-source';
import { SiteWiseAssetModule } from '../sitewise/siteWiseAssetModule';

const getAssetModule = ({ siteWiseApiOverride } = { siteWiseApiOverride: {} }) => {
  const siteWiseClient = createMockSiteWiseSDK(siteWiseApiOverride);

  const assetDataSource: SiteWiseAssetDataSource = createSiteWiseAssetDataSource(siteWiseClient);
  const assetModule = new SiteWiseAssetModule(assetDataSource);

  return { assetModule };
};

it('correctly parses query and yields asset models', async () => {
  const describeAsset = jest.fn().mockResolvedValue({
    id: ALARM_ASSET_ID,
    assetModelId: ASSET_MODEL_WITH_ALARM.assetModelId,
  });
  const describeAssetModel = jest.fn().mockResolvedValue(ASSET_MODEL_WITH_ALARM);

  const { assetModule } = getAssetModule({ siteWiseApiOverride: { describeAsset, describeAssetModel } });
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

  expect(await assetModels.next()).toEqual(
    expect.objectContaining({
      value: {
        assetModels: {
          'alarm-asset-id': ASSET_MODEL_WITH_ALARM,
        },
      },
    })
  );
});

it('yields error', async () => {
  const describeAsset = jest.fn().mockResolvedValue(new Error('Oops'));

  const { assetModule } = getAssetModule({ siteWiseApiOverride: { describeAsset } });
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

  expect(await assetModels.next()).toEqual(
    expect.objectContaining({
      value: {
        errors: {
          'alarm-asset-id': expect.any(Error),
        },
      },
    })
  );
});
