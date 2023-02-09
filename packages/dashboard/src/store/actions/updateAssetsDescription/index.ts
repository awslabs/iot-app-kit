// some action to respond to the saga DESCRIBE_ASSET_SUCCEEDED
// this will map in that described asset properties object map into the appkit widget object.

import { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';
import { Action } from 'redux';
import { DashboardState } from '../../state';

type UpdateAssetsDescriptionMapPayload = {
  describedAssets: DescribeAssetResponse[];
};

export interface UpdateAssetsDescriptionMapAction extends Action {
  type: 'UPDATE_ASSETS_DESCRIPTION';
  payload: UpdateAssetsDescriptionMapPayload;
}

export const onUpdateAssetsDescriptionMap = (
  payload: UpdateAssetsDescriptionMapPayload
): UpdateAssetsDescriptionMapAction => ({
  type: 'UPDATE_ASSETS_DESCRIPTION',
  payload,
});

export const updateAssetDescriptionMap = (
  state: DashboardState,
  action: UpdateAssetsDescriptionMapAction
): DashboardState => {
  const newMap = {
    ...state.assetsDescriptionMap,
  };
  action.payload.describedAssets.forEach((description) => {
    const assetId = description.assetId || '';
    newMap[assetId] = description;
  });
  return {
    ...state,
    assetsDescriptionMap: { ...newMap },
  };
};
