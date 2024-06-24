

import { assistantContext, setContext, appendContext } from '@iot-app-kit/chatbot-core';

export const useAssistantContext = () => {
  return {
    assistantContext,
    setContext,
    appendContext,
  }
}