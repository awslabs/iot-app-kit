import { SiteWiseAssetModule } from './siteWiseAssetModule';
import { createSiteWiseAssetDataSource } from '../asset-data-source';
import { ASSET_MODEL } from '../../__mocks__/assetModel';
import { ASSET_SUMMARY, DESCRIBE_ASSET_RESPONSE } from '../../__mocks__/asset';
import type { SiteWiseAssetDataSource } from './types';
import { createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

it('initializes', () => {
  expect(
    () => new SiteWiseAssetModule({} as SiteWiseAssetDataSource)
  ).not.toThrowError();
});

describe('startSession', () => {
  const module = new SiteWiseAssetModule({} as SiteWiseAssetDataSource);
  it('getSession', () => {
    expect(() => module.startSession()).not.toBeUndefined();
  });
});

describe('fetchAsset', () => {
  it('returns asset summary', async () => {
    const module = new SiteWiseAssetModule(
      createSiteWiseAssetDataSource(
        createMockSiteWiseSDK({
          describeAsset: () => Promise.resolve(DESCRIBE_ASSET_RESPONSE),
        })
      )
    );

    const session = module.startSession();
    const assetSummary = await session.fetchAssetSummary({
      assetId: DESCRIBE_ASSET_RESPONSE.assetId as string,
    });
    expect(assetSummary).toEqual(ASSET_SUMMARY);
  });

  it('returns the cached asset summary when re-requested', async () => {
    const describeAsset = jest.fn().mockResolvedValue(DESCRIBE_ASSET_RESPONSE);

    const module = new SiteWiseAssetModule(
      createSiteWiseAssetDataSource(
        createMockSiteWiseSDK({
          describeAsset,
        })
      )
    );

    const session = module.startSession();
    await session.fetchAssetSummary({ assetId: ASSET_SUMMARY.id as string });
    describeAsset.mockReset();
    const assetSummary = await session.fetchAssetSummary({
      assetId: ASSET_SUMMARY.id as string,
    });
    expect(assetSummary).toEqual(ASSET_SUMMARY);
    expect(describeAsset).not.toBeCalled();
  });

  it('throws error when API returns an error', async () => {
    const ERROR = {
      message: 'id not found',
      name: 'ResourceNotFoundException',
      $metadata: { httpStatusCode: 404 },
    };
    const describeAsset = jest.fn().mockRejectedValue(ERROR);

    const module = new SiteWiseAssetModule(
      createSiteWiseAssetDataSource(
        createMockSiteWiseSDK({
          describeAsset,
        })
      )
    );

    const session = module.startSession();

    await expect(
      session.fetchAssetSummary({ assetId: ASSET_SUMMARY.id as string })
    ).rejects.toEqual({
      msg: ERROR.message,
      type: ERROR.name,
      status: ERROR.$metadata.httpStatusCode,
    });
  });
});

describe('fetchAssetModel', () => {
  it('returns asset model when calling fetchAssetModel', async () => {
    const module = new SiteWiseAssetModule(
      createSiteWiseAssetDataSource(
        createMockSiteWiseSDK({
          describeAssetModel: () => Promise.resolve(ASSET_MODEL),
        })
      )
    );

    const session = module.startSession();
    const assetModel = await session.fetchAssetModel({
      assetModelId: ASSET_MODEL.assetModelId as string,
    });
    expect(assetModel).toEqual(ASSET_MODEL);
  });
});
