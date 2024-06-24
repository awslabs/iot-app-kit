import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';

export const useAssistant = (
  assistantClient: IoTSitewiseAssistantClient,
  options: {
      assistantName: string; // required to call invokeAssistant
      
      // optional but a default implementation will be provided
      messageParser?: IMessageParser; 
      stateManager?: BaseStateManager;
      
      // Defines an object that will be injected into the chatbot state
      initialState?: Record<string, any>;
  }
) => {...}