import { SiteWiseClient } from './client';
import { createSiteWiseSDK } from '../../common/tests/util';
import { ASSET_PROPERTY_DOUBLE_VALUE } from '../../common/tests/mocks/assetPropertyValue';

it('initializes', () => {
  expect(() => new SiteWiseClient(createSiteWiseSDK({}))).not.toThrowError();
});

describe('getLatestPropertyDataPoint', () => {
  it('returns data point on success', async () => {
    const getAssetPropertyValue = jest.fn().mockResolvedValue(ASSET_PROPERTY_DOUBLE_VALUE);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const client = new SiteWiseClient(createSiteWiseSDK({ getAssetPropertyValue }));

    const dataPoint = await client.getLatestPropertyDataPoint({ assetId, propertyId });
    expect(getAssetPropertyValue).toBeCalledWith({ assetId, propertyId });
    expect(dataPoint).toEqual({
      y: ASSET_PROPERTY_DOUBLE_VALUE.propertyValue?.value?.doubleValue,
      x: 1000099,
    });
  });

  it('throws an error on failure', async () => {
    const ERR = new Error('some scary error');
    const getAssetPropertyValue = jest.fn().mockRejectedValue(ERR);
    const assetId = 'some-asset-id';
    const propertyId = 'some-property-id';

    const client = new SiteWiseClient(createSiteWiseSDK({ getAssetPropertyValue }));

    await expect(client.getLatestPropertyDataPoint({ assetId, propertyId })).rejects.toThrowError(ERR);
  });
});
