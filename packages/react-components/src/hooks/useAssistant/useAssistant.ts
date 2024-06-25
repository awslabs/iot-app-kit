import { useState } from 'react';
import type { AssistantClientInvocationResponse, AssistantClientSummarizationProperties } from '@iot-app-kit/core-util';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import type {  IMessageParser, BaseStateManager, IMessage } from './types';
import { SenderType } from './types';
import { MessageParser } from './messageParser';
import { StateManager } from './stateManager';

export interface IUseAssistant {
  assistantClient: IoTSitewiseAssistantClient,
  
  /** optional but a default implementation will be provided */
  messageParser?: IMessageParser & MessageParser; 
  stateManager?: BaseStateManager & StateManager<any>;
}

const internalStateManager = new StateManager(() => {});
const internalMessageParser =  new MessageParser();

export const useAssistant = ({
  assistantClient,
  messageParser,
  stateManager,
}: IUseAssistant) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  let currentStateManager = internalStateManager;
  let currentMessageParser = internalMessageParser;

  if (stateManager) {
    currentStateManager = stateManager;
    currentMessageParser.setStateManager(stateManager);
  }

  if (messageParser) {
    currentMessageParser = messageParser;
    currentMessageParser.setStateManager(currentStateManager);
  }

  const onResponse = (
    response: AssistantClientInvocationResponse
  ) => {
    if (response.statusCode === 200) {
      currentMessageParser.parse(response.body);
      setMessages(currentStateManager.getState().messages);
    }
  };

  const onComplete = (
    response: AssistantClientInvocationResponse
  ) => {
    if (response.statusCode === 200) {
      currentMessageParser.parse(response.body);
      setMessages(currentStateManager.getState().messages);
    }
  };

  assistantClient.setRequestHandlers(
    assistantClient.onResponse ? assistantClient.onResponse : onResponse,
    assistantClient.onComplete ? assistantClient.onComplete : onComplete,
  );

  const invokeAssistant = (conversationId: string, utterance: string, context?: string) => {
    currentStateManager.addText(utterance, SenderType.USER);
    assistantClient.invoke(conversationId, utterance, context);
  }

  const generateSummary = (
    conversationId: string,
    sitewiseProperties: AssistantClientSummarizationProperties,
    summaryUtterance?: string,
    summaryInstructions?: string
  ) => {
    if (summaryUtterance) { 
      currentStateManager.addText(summaryUtterance, SenderType.USER);
    }
    assistantClient.generateSummary(conversationId, sitewiseProperties, summaryUtterance, summaryInstructions);
  }

  return {
    messages,
    invokeAssistant,
    generateSummary,
    endConversation: assistantClient.endConversation,
  }
}
