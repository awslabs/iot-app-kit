import { Widget } from '~/types';
import { DashboardState, initialState } from '../../state';
import { onUpdateAssetsDescriptionMap, updateAssetDescriptionMap } from './index';
import { DescribeAssetResponse, PropertyDataType } from '@aws-sdk/client-iotsitewise';

const setupDashboardState = (widgets: Widget[] = []): DashboardState => ({
  ...initialState,
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
  assetsDescriptionMap: {},
});

const MOCK_RESPONSE: DescribeAssetResponse = {
  assetArn: 'ARN',
  assetCreationDate: new Date(),
  assetHierarchies: [],
  assetId: 'ASSET_ID',
  assetLastUpdateDate: new Date('2000-1-1'),
  assetModelId: 'MODEL_ID',
  assetName: 'Mock asset',
  assetProperties: [
    { name: 'PropertyA', id: 'property-a', dataType: PropertyDataType.STRING },
    { name: 'PropertyB', id: 'property-b', dataType: PropertyDataType.DOUBLE },
    { name: 'PropertyC', id: 'property-c', dataType: PropertyDataType.BOOLEAN },
  ],
  assetStatus: undefined,
};

it('does nothing if no asset descriptions are provided', () => {
  const state = setupDashboardState();
  expect(
    updateAssetDescriptionMap(
      state,
      onUpdateAssetsDescriptionMap({
        describedAssets: [],
      })
    ).assetsDescriptionMap
  ).toMatchObject({});
});

it('update new asset description to assetsDescriptionMap', () => {
  const state = setupDashboardState();
  expect(
    updateAssetDescriptionMap(
      state,
      onUpdateAssetsDescriptionMap({
        describedAssets: [MOCK_RESPONSE],
      })
    ).assetsDescriptionMap
  ).toMatchObject({ [MOCK_RESPONSE.assetId as string]: MOCK_RESPONSE });
});

it('update asset description to assetsDescriptionMap', () => {
  const state = {
    ...setupDashboardState(),
    assetsDescriptionMap: { [MOCK_RESPONSE.assetId as string]: MOCK_RESPONSE },
  };
  expect(
    updateAssetDescriptionMap(
      state,
      onUpdateAssetsDescriptionMap({
        describedAssets: [{ ...MOCK_RESPONSE, assetName: 'new name' }],
      })
    ).assetsDescriptionMap
  ).toMatchObject({ [MOCK_RESPONSE.assetId as string]: { ...MOCK_RESPONSE, assetName: 'new name' } });
});
