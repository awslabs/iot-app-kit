import type { Action } from 'redux';
import type { DashboardState } from '../../state';

interface UpdateDefaultViewportActionPayload {
  defaultViewport?: string | undefined;
}

export interface UpdateDefaultViewportAction extends Action {
  type: 'UPDATE_DEFAULT_VIEWPORT';
  payload: UpdateDefaultViewportActionPayload;
}

export const onUpdateDefaultViewportAction = (
  payload: UpdateDefaultViewportActionPayload
): UpdateDefaultViewportAction => ({
  type: 'UPDATE_DEFAULT_VIEWPORT',
  payload,
});

export const updateDefaultViewport = (
  state: DashboardState,
  action: UpdateDefaultViewportAction
): DashboardState => {
  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      ...action.payload,
    },
  };
};
