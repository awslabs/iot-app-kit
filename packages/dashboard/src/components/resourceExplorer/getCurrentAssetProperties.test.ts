import { getCurrentAssetProperties } from './getCurrentAssetProperties';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { DashboardMessages } from '../../messages';

const listAssetPropertiesResponse = {
  assetPropertySummaries: [
    { id: 'Asset Property 1', alias: 'Temperature' },
    { id: 'Asset Property 2', alias: 'Pressure' },
  ],
};

const getCurrentAssetPropertiesResponse = [
  {
    id: 'Asset Properties',
    name: 'Asset Properties',
    isHeader: true,
    isAssetProperty: false,
    queryAssetsParam: [],
  },
  {
    id: 'Asset Property 1',
    name: 'Temperature',
    isAssetProperty: true,
    queryAssetsParam: [
      {
        assetId: 'Asset 1',
        properties: [
          {
            propertyId: 'Asset Property 1',
          },
        ],
      },
    ],
  },
  {
    id: 'Asset Property 2',
    name: 'Pressure',
    isAssetProperty: true,
    queryAssetsParam: [
      {
        assetId: 'Asset 1',
        properties: [
          {
            propertyId: 'Asset Property 2',
          },
        ],
      },
    ],
  },
];

const messageOverrides = {
  resourceExplorer: {
    assetPropertiesHeader: 'Asset Properties',
  },
} as DashboardMessages;

describe('getCurrentAssetProperties', () => {
  it('should return an array of asset properties', async () => {
    const client: unknown = {
      send: async () => listAssetPropertiesResponse,
    };
    const result = await getCurrentAssetProperties('Asset 1', messageOverrides, client as IoTSiteWiseClient);
    expect(result).toEqual(getCurrentAssetPropertiesResponse);
  });

  it('should return empty array when currentBranchId is hierarchy root id', async () => {
    const client: unknown = {
      send: async () => listAssetPropertiesResponse,
    };
    const result = await getCurrentAssetProperties('HIERARCHY_ROOT_ID', messageOverrides, client as IoTSiteWiseClient);
    expect(result).toEqual([]);
  });

  it('should return empty array when assetPropertieSummaries is not found', async () => {
    const client: unknown = {
      send: async () => ({ foo: 'bar' }),
    };
    const result = await getCurrentAssetProperties('Asset 1', messageOverrides, client as IoTSiteWiseClient);
    expect(result).toEqual([]);
  });

  it('should return empty array when there are no aliased properties', async () => {
    const client: unknown = {
      send: async () => ({
        assetPropertySummaries: [{ id: 'Asset Property 1' }, { id: 'Asset Property 2' }],
      }),
    };
    const result = await getCurrentAssetProperties('Asset 1', messageOverrides, client as IoTSiteWiseClient);
    expect(result).toEqual([]);
  });

  it('should return empty array when there is an error', async () => {
    const client: unknown = {
      send: async () => {
        throw new Error('Something went wrong!');
      },
    };
    const result = await getCurrentAssetProperties('Asset 1', messageOverrides, client as IoTSiteWiseClient);
    expect(result).toEqual([]);
  });
});
