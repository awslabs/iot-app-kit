import { getCurrentAssetProperties } from './getCurrentAssetProperties';
import { ExtendedPanelAssetSummary } from '.';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { DashboardMessages } from '../../messages';
import { getEnvCredentials } from '../../../testing/getEnvCredentials';

jest.mock('@aws-sdk/client-iotsitewise');
jest.mock('../../../testing/getEnvCredentials');
const mockGetEnvCredentials = getEnvCredentials as jest.MockedFunction<typeof getEnvCredentials>;

mockGetEnvCredentials.mockResolvedValue({
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
} as never);

describe('getCurrentAssetProperties', () => {
  const messageOverrides = {
    resourceExplorer: {
      assetPropertiesHeader: 'Asset Properties',
    },
  } as DashboardMessages;

  beforeEach(() => {
    (IoTSiteWiseClient.prototype.send as jest.Mock).mockResolvedValue({
      assetPropertySummaries: [
        { id: 'Asset Property 1', alias: 'Temperature' },
        { id: 'Asset Property 2', alias: 'Pressure' },
      ],
    });
  });

  it('should return an array of asset properties', async () => {
    const result = await getCurrentAssetProperties('Asset 1', messageOverrides);
    expect(result).toEqual([
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
    ] as ExtendedPanelAssetSummary[]);
  });

  it('should return empty array when currentBranchId is hierarchy root id', async () => {
    const result = await getCurrentAssetProperties('HIERARCHY_ROOT_ID', messageOverrides);
    expect(result).toEqual([]);
  });

  it('should return empty array when assetProperties is not found', async () => {
    (IoTSiteWiseClient.prototype.send as jest.Mock).mockResolvedValue({});
    const result = await getCurrentAssetProperties('Asset 1', messageOverrides);
    expect(result).toEqual([]);
  });

  it('should return empty array when there is no aliased properties', async () => {
    (IoTSiteWiseClient.prototype.send as jest.Mock).mockResolvedValue({
      assetPropertySummaries: [
        { id: 'Asset Property 1', alias: null },
        { id: 'Asset Property 2', alias: null },
      ],
    });
    const result = await getCurrentAssetProperties('Asset 1', messageOverrides);
    expect(result).toEqual([]);
  });

  it('should return empty array when there is an error', async () => {
    (IoTSiteWiseClient.prototype.send as jest.Mock).mockRejectedValue(new Error('Test error'));
    const result = await getCurrentAssetProperties('Asset 1', messageOverrides);
    expect(result).toEqual([]);
  });
});
