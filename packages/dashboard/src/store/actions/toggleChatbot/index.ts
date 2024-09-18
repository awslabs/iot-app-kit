import type { IMessage } from '@iot-app-kit/react-components';
import type { DashboardState } from '../../state';
import type { Action } from 'redux';

type ToggleChatbotActionPayload = {
  open: boolean;
  componentId: string;
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
      componentId: action.payload.componentId,
      messages: action.payload.messages,
    },
  };
};
