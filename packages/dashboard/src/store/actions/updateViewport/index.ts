import type { Action } from 'redux';
import type { DashboardWidgetsConfiguration } from '~/types';
import type { DashboardState } from '../../state';

type UpdateViewportActionPayload = {
  viewport: DashboardWidgetsConfiguration['viewport'];
};
export interface UpdateViewportAction extends Action {
  type: 'UPDATE_VIEWPORT';
  payload: UpdateViewportActionPayload;
}

export const onUpdateViewportAction = (payload: UpdateViewportActionPayload): UpdateViewportAction => ({
  type: 'UPDATE_VIEWPORT',
  payload,
});

export const updateViewport = (state: DashboardState, action: UpdateViewportAction): DashboardState => {
  const viewport = action.payload.viewport;

  return {
    ...state,
    dashboardConfiguration: {
      ...state.dashboardConfiguration,
      viewport,
    },
  };
};
