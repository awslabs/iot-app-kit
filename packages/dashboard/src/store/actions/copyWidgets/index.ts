import { Action } from 'redux';

import intersectionBy from 'lodash/intersectionBy';

import { Widget } from '~/types';
import { DashboardState } from '../../state';

type CopyWidgetsActionPayload = {
  widgets: Widget[];
};

export interface CopyWidgetsAction extends Action {
  type: 'COPY_WIDGETS';
  payload: CopyWidgetsActionPayload;
}

export const onCopyWidgetsAction = (payload: CopyWidgetsActionPayload): CopyWidgetsAction => ({
  type: 'COPY_WIDGETS',
  payload,
});

export const copyWidgets = (state: DashboardState, action: CopyWidgetsAction): DashboardState => {
  const copiedWidgets = intersectionBy(state.dashboardConfiguration.widgets, action.payload.widgets, 'id');

  return {
    ...state,
    copiedWidgets,
    pasteCounter: 0,
  };
};
