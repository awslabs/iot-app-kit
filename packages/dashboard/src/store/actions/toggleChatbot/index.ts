import type { DashboardState } from '../../state';
import type { Action } from 'redux';

type ToggleChatbotActionPayload = {
  open: boolean;
};

export interface ToggleChatbotAction extends Action {
  type: 'TOGGLE_CHATBOT';
  payload: ToggleChatbotActionPayload;
}

export const onToggleChatbotAction = (
  payload: ToggleChatbotActionPayload
): ToggleChatbotAction => ({
  type: 'TOGGLE_CHATBOT',
  payload,
});

export const toggleChatbot = (
  state: DashboardState,
  action: ToggleChatbotAction
): DashboardState => {
  const assistant = state.assistant;

  return {
    ...state,
    assistant: {
      ...assistant,
      isChatbotOpen: action.payload.open,
    },
  };
};
