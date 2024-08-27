import { useEffect, useState } from 'react';
import type { AssistantClientInvocationResponse } from '@iot-app-kit/core-util';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import type { IMessageParser, BaseStateManager, IMessage } from './types';
import { MessageParser } from './messageParser';
import { StateManager } from './stateManager';
import useDataStore from '../../store';

export interface IUseAssistant {
  assistantClient: IoTSitewiseAssistantClient;

  /** optional but a default implementation will be provided */
  messageParser?: IMessageParser & MessageParser;
  stateManager?: BaseStateManager & StateManager;

  initialState?: Record<string, any>;
}

const loadingMessage = 'loading...';
const internalMessageParser = new MessageParser();
const internalStateManager = new StateManager(
  () => {},
  () => ({ messages: [] }),
  () => {}
);

export const useAssistant = ({
  assistantClient,
  messageParser,
  stateManager,
  initialState,
}: IUseAssistant) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentStateManager, setStateManager] =
    useState<StateManager>(internalStateManager);
  const [currentMessageParser, setMessageParser] = useState<MessageParser>(
    internalMessageParser
  );
  const storeState = useDataStore.getState();

  useEffect(() => {
    let newStateManager = currentStateManager;
    let newMessageParser = currentMessageParser;

    if (stateManager) {
      newStateManager = stateManager;
    } else {
      newStateManager.setStateFns(
        storeState.setAssistantState,
        storeState.getAssistantState,
        storeState.clearAssistantState
      );
    }

    if (messageParser) {
      newMessageParser = messageParser;
    }
    if (initialState) {
      newStateManager.clearState();
      newStateManager.setState(initialState);
    }

    newMessageParser.setStateManager(newStateManager);
    setStateManager(newStateManager);
    setMessageParser(newMessageParser);
    setMessages(newStateManager.getState().messages);
  }, []);

  const removeLoadingMessages = () => {
    const indexesToDelete: number[] = [];
    currentStateManager
      .getState()
      .messages.forEach((message: IMessage, index: number) => {
        if (message.loading) {
          indexesToDelete.push(index);
        }
      });

    indexesToDelete
      .slice()
      .reverse()
      .forEach((i: number) => currentStateManager.removeMessage(i));
  };

  const onResponse = (response: AssistantClientInvocationResponse) => {
    removeLoadingMessages();
    currentMessageParser.parse(response.body);
    setMessages(currentStateManager.getState().messages);
  };

  const onComplete = (response: AssistantClientInvocationResponse) => {
    removeLoadingMessages();
    currentMessageParser.parse(response.body);
    setMessages(currentStateManager.getState().messages);
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
    storeState.clearAssistantState();
    currentStateManager.addText(utterance, 'user');
    currentStateManager.addPartialResponse(loadingMessage);
    setMessages(currentStateManager.getState().messages);
    assistantClient.invoke(conversationId, utterance, context);
  };

  const generateSummary = (
    conversationId: string,
    context: string,
    summaryUtterance?: string
  ) => {
    storeState.clearAssistantState();
    if (summaryUtterance) {
      currentStateManager.addText(summaryUtterance, 'user');
      currentStateManager.addPartialResponse(loadingMessage);
      setMessages(currentStateManager.getState().messages);
    }
    assistantClient.generateSummary(conversationId, context, summaryUtterance);
  };

  return {
    messages,
    invokeAssistant,
    generateSummary,
  };
};
