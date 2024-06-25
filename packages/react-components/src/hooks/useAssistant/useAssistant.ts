import messages from '@cloudscape-design/components/i18n/messages/all.all';
import type { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import type { IMessageParser, BaseStateManager } from './types';
import { MessageParser } from './messageParser';
import { StateManager } from './stateManager';

export interface IUseAssistant {
  assistantClient: IoTSitewiseAssistantClient,
  /** required to call invokeAssistant */ 
  assistantName: string; 
  
  /** optional but a default implementation will be provided */
  messageParser?: IMessageParser; 
  stateManager?: BaseStateManager;
      
  // Defines an object that will be injected into the chatbot state
  // initialState?: Record<string, any>;
}

const createDefaultMessageParger = () => {
  return new MessageParser( new StateManager() );
}

export const useAssistant = ({
  assistantClient,
  assistantName,
  messageParser,
  stateManager,
}: IUseAssistant) => {

  const invokeAssistant = () => {
    assistantClient.
  }
  

  return {
    messages ??,
    invokeAssistant,
    endConversation,
    generateSummary
  }
}