// WIP: adding tests against saga.

import { expectSaga } from 'redux-saga-test-plan';
import { describeAssetSaga, getAssetsDescriptionMap, sendCommand } from './index';
import { select } from 'redux-saga/effects';
import { Widget } from '~/types';
import { DashboardState, initialState } from '../../state';
import * as matchers from 'redux-saga-test-plan/matchers';
import { DescribeAssetResponse, PropertyDataType } from '@aws-sdk/client-iotsitewise';
import { onUpdateAssetsDescriptionMap } from '../../actions/updateAssetsDescription';
import { onUpdateAssetQueryAction } from '../../actions/updateAssetQuery';
import { MOCK_KPI_WIDGET } from '../../../../testing/mocks';
import { AssetQuery } from '@iot-app-kit/core';
import { dashboardReducer } from '../../reducer';
import { onDescribeAssetFailed } from './failed';

const TEST_TIME_OUT_IN_MS = 1000;
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
const mockFn = jest.fn();
const setupDashboardState = (widgets: Widget[] = []): DashboardState => ({
  ...initialState,
  dashboardConfiguration: {
    ...initialState.dashboardConfiguration,
    widgets,
  },
  assetsDescriptionMap: {},
});

const MOCK_ASSET_QUERY: AssetQuery[] = [
  {
    assetId: 'ASSET_ID',
    properties: [{ propertyId: 'PropertyA' }, { propertyId: 'PropertyB' }],
  },
];

it('updates asset description map on UpdateAssetQuery', () => {
  const state = setupDashboardState([MOCK_KPI_WIDGET]);
  return expectSaga(describeAssetSaga)
    .provide([
      [select(getAssetsDescriptionMap), state],
      [matchers.call.fn(sendCommand), MOCK_RESPONSE],
    ])
    .put(
      onUpdateAssetsDescriptionMap({
        describedAssets: [MOCK_RESPONSE],
      })
    )
    .dispatch(
      onUpdateAssetQueryAction({
        widget: MOCK_KPI_WIDGET,
        assetQuery: MOCK_ASSET_QUERY,
      })
    )
    .run(TEST_TIME_OUT_IN_MS);
});

it('does not making requests if asset has been cached', () => {
  jest.resetAllMocks();
  const state: DashboardState = {
    ...setupDashboardState([MOCK_KPI_WIDGET]),
    assetsDescriptionMap: {
      [MOCK_ASSET_QUERY[0].assetId]: MOCK_RESPONSE,
    },
  };

  return expectSaga(describeAssetSaga)
    .withReducer(dashboardReducer, state)
    .provide({
      call(effect, next) {
        if (effect.fn === sendCommand) {
          mockFn();
          return MOCK_RESPONSE;
        }
        return next();
      },
    })
    .put(
      onUpdateAssetsDescriptionMap({
        describedAssets: [],
      })
    )
    .dispatch(
      onUpdateAssetQueryAction({
        widget: MOCK_KPI_WIDGET,
        assetQuery: MOCK_ASSET_QUERY,
      })
    )
    .run(TEST_TIME_OUT_IN_MS)
    .then(() => {
      expect(mockFn).not.toBeCalled();
    });
});

it('does put DescribeAssetFailed action on error', () => {
  const state: DashboardState = {
    ...setupDashboardState([MOCK_KPI_WIDGET]),
    assetsDescriptionMap: {},
  };
  const error = new Error('Expected: Something wrong during describing asset');
  return expectSaga(describeAssetSaga)
    .withReducer(dashboardReducer, state)
    .provide({
      call(effect, next) {
        if (effect.fn === sendCommand) {
          console.log(error);
          throw error;
        }
        return next();
      },
    })
    .put(onDescribeAssetFailed({ error }))
    .dispatch(
      onUpdateAssetQueryAction({
        widget: MOCK_KPI_WIDGET,
        assetQuery: MOCK_ASSET_QUERY,
      })
    )
    .run(TEST_TIME_OUT_IN_MS);
});
