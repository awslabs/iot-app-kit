import { Messages } from '../types';

export type AssistantChatbotMessageKeys =
  | 'assistant-chatbot.disclaimer'
  | 'assistant-chatbot.inputPlaceholder'
  | 'assistant-chatbot.close'
  | 'assistant-chatbot.reset';

export const AssistantActionPanel: Messages<AssistantChatbotMessageKeys> = {
  en: {
    'assistant-chatbot.disclaimer':
      'Responses are AI-generated and for informational purposes only',
    'assistant-chatbot.inputPlaceholder': 'Ask me anything about your IoT data',
    'assistant-chatbot.close': 'Close',
    'assistant-chatbot.reset': 'Reset',
  },
};
