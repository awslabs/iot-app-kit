import type { DashboardState } from '../../state';
import type { Action } from 'redux';
import { v4 as uuid } from 'uuid';

export interface CleanAssistantAction extends Action {
  type: 'CLEAN_ASSISTANT';
}

export const onCleanAssistantAction = (): CleanAssistantAction => ({
  type: 'CLEAN_ASSISTANT',
});

export const cleanAssistant = (state: DashboardState): DashboardState => {
  return {
    ...state,
    assistant: {
      ...state.assistant,
      conversationId: uuid(),
      callerComponentId: undefined,
      action: undefined,
    },
  };
};
