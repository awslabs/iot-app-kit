import { type Messages } from '../types';

export type AssistantChatbotMessageKeys =
  | 'assistant-chatbot.disclaimer'
  | 'assistant-chatbot.inputPlaceholder'
  | 'assistant-chatbot.close'
  | 'assistant-chatbot.reset'
  | 'assistant-chatbot.newChat'
  | 'assistant-chatbot.message.copy'
  | 'assistant-chatbot.message.copyError'
  | 'assistant-chatbot.message.copySuccess';

export const AssistantActionPanel: Messages<AssistantChatbotMessageKeys> = {
  en: {
    'assistant-chatbot.disclaimer':
      'Responses are AI-generated and for informational purposes only',
    'assistant-chatbot.inputPlaceholder': 'Ask me anything about your IoT data',
    'assistant-chatbot.close': 'Close',
    'assistant-chatbot.reset': 'Reset',
    'assistant-chatbot.newChat': 'New chat',
    'assistant-chatbot.message.copy': 'Copy',
    'assistant-chatbot.message.copyError': 'Failed to copy',
    'assistant-chatbot.message.copySuccess': 'Content copied',
  },
};
