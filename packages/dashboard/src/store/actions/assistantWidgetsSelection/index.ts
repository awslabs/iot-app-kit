import type { Action } from 'redux';
import type { DashboardState } from '../../state';
import { uniqBy } from 'lodash';

export type AssistantSelectWidgetsActionPayload = {
  widgetId: string;
  widgetType: string;
  selectedProperties: number;
};

type AssistantDeselectWidgetsActionPayload = {
  widgetId: string;
};

export interface AssistantSelectWidgetsAction extends Action {
  type: 'ASSISTANT_SELECT_WIDGETS';
  payload: AssistantSelectWidgetsActionPayload;
}

export const onAssistantSelectWidgetsAction = (
  payload: AssistantSelectWidgetsActionPayload
): AssistantSelectWidgetsAction => ({
  type: 'ASSISTANT_SELECT_WIDGETS',
  payload,
});

export const assistantSelectWidgets = (
  state: DashboardState,
  action: AssistantSelectWidgetsAction
): DashboardState => ({
  ...state,
  assistant: {
    ...state.assistant,
    selectedQueries: uniqBy(
      [...state.assistant.selectedQueries, action.payload],
      'widgetId'
    ),
  },
});

export interface AssistantDeselectWidgetsAction extends Action {
  type: 'ASSISTANT_DESELECT_WIDGETS';
  payload: AssistantDeselectWidgetsActionPayload;
}

export const onAssistantDeselectWidgetsAction = (
  payload: AssistantDeselectWidgetsActionPayload
): AssistantDeselectWidgetsAction => ({
  type: 'ASSISTANT_DESELECT_WIDGETS',
  payload,
});

export const assistantDeselectWidgets = (
  state: DashboardState,
  action: AssistantDeselectWidgetsAction
): DashboardState => ({
  ...state,
  assistant: {
    ...state.assistant,
    selectedQueries: state.assistant.selectedQueries.filter(
      ({ widgetId }) => widgetId !== action.payload.widgetId
    ),
  },
});

export interface AssistantCleanWidgetsSelectionAction extends Action {
  type: 'ASSISTANT_CLEAN_WIDGETS_SELECTION';
}

export const onAssistantCleanWidgetsSelectionAction =
  (): AssistantCleanWidgetsSelectionAction => ({
    type: 'ASSISTANT_CLEAN_WIDGETS_SELECTION',
  });

export const assistantCleanWidgetsSelection = (
  state: DashboardState,
  _action: AssistantCleanWidgetsSelectionAction
): DashboardState => ({
  ...state,
  assistant: {
    ...state.assistant,
    selectedQueries: [],
  },
});
