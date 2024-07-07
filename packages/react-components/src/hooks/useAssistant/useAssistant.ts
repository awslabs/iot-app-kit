import { useState } from 'react';
import type { AssistantClientInvocationResponse } from '@iot-app-kit/core-util';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import type { IMessageParser, BaseStateManager, IMessage } from './types';
import { SenderType } from './types';
import { MessageParser } from './messageParser';
import { StateManager } from './stateManager';
import useDataStore from '../../store';

export interface IUseAssistant {
  assistantClient: IoTSitewiseAssistantClient;

  /** optional but a default implementation will be provided */
  messageParser?: IMessageParser & MessageParser;
  stateManager?: BaseStateManager & StateManager;
}

const internalMessageParser = new MessageParser();
const internalStateManager = new StateManager(
  () => {},
  () => {}
);

export const useAssistant = ({
  assistantClient,
  messageParser,
  stateManager,
}: IUseAssistant) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const storeState = useDataStore.getState();
  internalStateManager.setStateFns(
    storeState.setAssistantState,
    storeState.getAssistantState
  );

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

  const onResponse = (response: AssistantClientInvocationResponse) => {
    if (response.statusCode === 200) {
      currentMessageParser.parse(response.body);
      setMessages(currentStateManager.getState().messages);
    }
  };

  const onComplete = (response: AssistantClientInvocationResponse) => {
    if (response.statusCode === 200) {
      currentMessageParser.parse(response.body);
      setMessages(currentStateManager.getState().messages);
    }
  };

  assistantClient.setRequestHandlers(
    assistantClient.onResponse ? assistantClient.onResponse : onResponse,
    assistantClient.onComplete ? assistantClient.onComplete : onComplete
  );

  const invokeAssistant = (
    conversationId: string,
    utterance: string,
    context?: string
  ) => {
    currentStateManager.addText(utterance, SenderType.USER);
    assistantClient.invoke(conversationId, utterance, context);
  };

  const generateSummary = (
    conversationId: string,
    context: string,
    summaryUtterance?: string,
  ) => {
    if (summaryUtterance) {
      currentStateManager.addText(summaryUtterance, SenderType.USER);
    }
    assistantClient.generateSummary(
      conversationId,
      context,
      summaryUtterance,
    );
  };

  return {
    messages,
    invokeAssistant,
    generateSummary,
  };
};
