import type { IMessage } from '@iot-app-kit/react-components';
import type { DashboardState } from '../../state';
import type { Action } from 'redux';

type ToggleChatbotActionPayload = {
  open: boolean;
  callerComponentId: string;
  action?: 'summary';
  messages: IMessage[];
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
  return {
    ...state,
    assistant: {
      ...state.assistant,
      isChatbotOpen: action.payload.open,
      callerComponentId: action.payload.callerComponentId,
      action: action.payload.action,
      messages: action.payload.messages,
    },
  };
};
