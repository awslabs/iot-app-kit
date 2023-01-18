import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { UpdateAssetQueryAction } from '../../actions/updateAssetQuery';
import { DescribeAssetCommand, DescribeAssetResponse, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { DashboardState } from '../../state';
import { onUpdateAssetsDescriptionMap } from '../../actions/updateAssetsDescription';
import { Client } from '../../../util/IotSitewiseClient';
import { onDescribeAssetFailed } from './failed';

export const getAssetsDescriptionMap = (state: DashboardState) => state.assetsDescriptionMap;

export const sendCommand = (client: IoTSiteWiseClient, assetId: string) =>
  client.send(new DescribeAssetCommand({ assetId }));

// Worker saga will be fired on UPDATE_ASSET_QUERY actions
function* describeAsset(action: UpdateAssetQueryAction) {
  try {
    const client: IoTSiteWiseClient = Client.getInstance();
    const assetsMap: DashboardState['assetsDescriptionMap'] = yield select(getAssetsDescriptionMap);

    const describedAssets: DescribeAssetResponse[] = yield all(
      action.payload.assetQuery
        .filter(({ assetId }) => !assetsMap[assetId])
        .map(({ assetId }) => {
          return call(sendCommand, client, assetId);
        })
    );
    const updateAssetPropertiesAction = onUpdateAssetsDescriptionMap({
      describedAssets,
    });
    yield put(updateAssetPropertiesAction);
  } catch (error) {
    yield put(onDescribeAssetFailed({ error: error as Error }));
  }
}

export function* describeAssetSaga() {
  yield takeEvery('UPDATE_ASSET_QUERY', describeAsset);
}
