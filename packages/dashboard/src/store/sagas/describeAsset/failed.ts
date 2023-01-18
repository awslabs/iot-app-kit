import { Action } from 'redux';
import { DashboardState } from '../../state';

export interface DescribeAssetFailedAction extends Action {
  type: 'DESCRIBE_ASSET_FAILED';
  payload: DescribeAssetFailedPayload;
}

export type DescribeAssetFailedPayload = {
  error: Error;
};

export const onDescribeAssetFailed: (payload: DescribeAssetFailedPayload) => DescribeAssetFailedAction = (payload) => ({
  type: 'DESCRIBE_ASSET_FAILED',
  payload,
});

export const describeAssetFailed: (state: DashboardState, action: DescribeAssetFailedAction) => DashboardState = (
  state,
  action
) => {
  console.error(action.payload.error);
  return state;
};
