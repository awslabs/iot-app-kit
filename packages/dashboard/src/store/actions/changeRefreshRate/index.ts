import type { Action } from 'redux';
import { type RefreshRate } from '../../../components/refreshRate/types';
import type { DashboardState } from '../../state-old';

type UpdateRefreshRateActionPayload = {
  refreshRate: RefreshRate;
};

export interface UpdateRefreshRateAction extends Action {
  type: 'UPDATE_REFRESH_RATE';
  payload: UpdateRefreshRateActionPayload;
}

export const onUpdateRefreshRateAction = (
  payload: UpdateRefreshRateActionPayload
): UpdateRefreshRateAction => ({
  type: 'UPDATE_REFRESH_RATE',
  payload,
});

export const updateRefreshRate = (
  state: DashboardState,
  action: UpdateRefreshRateAction
): DashboardState => {
  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      querySettings: {
        ...state.dashboardConfiguration.querySettings,
        refreshRate: action.payload.refreshRate,
      },
    },
  };
};
