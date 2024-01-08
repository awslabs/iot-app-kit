import { mergeAssetQueries } from './mergeAssetQueries';
import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';

const MOCK_QUERY: SiteWiseAssetQuery = {
  assets: [
    {
      assetId: 'assetId',
      properties: [
        {
          propertyId: 'propertyId1',
        },
        {
          propertyId: 'propertyId2',
        },
        {
          propertyId: 'propertyId3',
        },
      ],
    },
  ],
};

const MOCK_ASSET: SiteWiseAssetQuery['assets'][number] = {
  assetId: 'assetId',
  properties: [
    {
      propertyId: 'newPropertyId1',
    },
  ],
};

const MOCK_ASSET2: SiteWiseAssetQuery['assets'][number] = {
  assetId: 'newAssetId',
  properties: [
    {
      propertyId: 'propertyId1',
    },
  ],
};

const MOCK_ASSET3: SiteWiseAssetQuery['assets'][number] = {
  assetId: 'assetId',
  properties: [
    {
      propertyId: 'propertyId1',
    },
  ],
};

it('should merge queries', () => {
  expect(mergeAssetQueries(MOCK_QUERY.assets, MOCK_ASSET)).toMatchObject([
    {
      assetId: 'assetId',
      properties: [
        ...MOCK_QUERY.assets[0].properties,
        ...MOCK_ASSET.properties,
      ],
    },
  ]);
});

it('should not merge queries with different asset id', () => {
  expect(mergeAssetQueries(MOCK_QUERY.assets, MOCK_ASSET2).length).toEqual(2);
});

it('should not contain duplicate properties', () => {
  const sortFn = (
    a: SiteWiseAssetQuery['assets'][number]['properties'][number],
    b: SiteWiseAssetQuery['assets'][number]['properties'][number]
  ) => a.propertyId.localeCompare(b.propertyId);
  expect(
    mergeAssetQueries(MOCK_QUERY.assets, MOCK_ASSET3)[0].properties.sort(sortFn)
  ).toMatchObject([...MOCK_QUERY.assets[0].properties].sort(sortFn));
});
