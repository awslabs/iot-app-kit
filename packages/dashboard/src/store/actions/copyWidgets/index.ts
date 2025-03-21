import type { Action } from 'redux';
import type { DashboardState } from '../../state';

export interface CopyWidgetsActionPayload {
  widgetIds: readonly string[];
}

export interface CopyWidgetsAction extends Action {
  type: 'COPY_WIDGETS';
  payload: CopyWidgetsActionPayload;
}

export const onCopyWidgetsAction = (
  payload: CopyWidgetsActionPayload
): CopyWidgetsAction => ({
  type: 'COPY_WIDGETS',
  payload,
});

export const copyWidgets = (
  state: DashboardState,
  { payload: { widgetIds } }: CopyWidgetsAction
): DashboardState => {
  return {
    ...state,
    copiedWidgetIds: widgetIds,
    pasteCounter: 0,
  };
};
