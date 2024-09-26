import { useEffect, useState } from 'react';
import type {
  AssistantClientInvocationError,
  AssistantClientInvocationResponse,
  AssistantInvocationRequest,
  InvokeAssistantOptions,
} from '@iot-app-kit/core-util';
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
    storeState.clearAssistantState();
  }, []);

  const removeLoadingMessages = (componentId: string) => {
    const indexesToDelete: number[] = [];
    currentStateManager
      .getState()
      .messages.forEach((message: IMessage, index: number) => {
        if (message.loading && message.originComponentId === componentId) {
          indexesToDelete.push(index);
        }
      });

    indexesToDelete
      .slice()
      .reverse()
      .forEach((i: number) => currentStateManager.removeMessage(i));
  };

  const onResponse = (
    request: AssistantInvocationRequest,
    response: AssistantClientInvocationResponse
  ) => {
    removeLoadingMessages(request.componentId);
    currentMessageParser.parse(request, response.body);
    setMessages(currentStateManager.getState().messages);
  };

  const onComplete = (
    request: AssistantInvocationRequest,
    response: AssistantClientInvocationResponse
  ) => {
    removeLoadingMessages(request.componentId);
    currentMessageParser.parse(request, response.body);
    setMessages(currentStateManager.getState().messages);
  };

  const onError = (
    request: AssistantInvocationRequest,
    error: AssistantClientInvocationError
  ) => {
    currentStateManager.addError(request, error.message ?? '');
    setMessages(currentStateManager.getState().messages);
  };

  assistantClient.setRequestHandlers(
    assistantClient.onResponse ? assistantClient.onResponse : onResponse,
    assistantClient.onComplete ? assistantClient.onComplete : onComplete,
    assistantClient.onError ? assistantClient.onError : onError
  );

  const invokeAssistant = ({
    componentId,
    conversationId,
    utterance,
    context,
  }: InvokeAssistantOptions) => {
    currentStateManager.addText(componentId, utterance, 'user');
    currentStateManager.addPartialResponse(componentId, loadingMessage);
    setMessages(currentStateManager.getState().messages);
    assistantClient.invoke({ componentId, conversationId, utterance, context });
  };

  const generateSummary = ({
    componentId,
    conversationId,
    utterance,
    context = '',
  }: InvokeAssistantOptions) => {
    if (utterance) {
      currentStateManager.addText(componentId, utterance, 'user');
      currentStateManager.addPartialResponse(componentId, loadingMessage);
      setMessages(currentStateManager.getState().messages);
    }
    assistantClient.generateSummary({
      componentId,
      conversationId,
      context,
      utterance,
    });
  };

  return {
    messages,
    setMessages,
    invokeAssistant,
    generateSummary,
  };
};
