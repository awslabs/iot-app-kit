import { useEffect, useState } from 'react';
import type {
  AssistantClientInvocationError,
  AssistantClientInvocationResponse,
  AssistantInvocationRequest,
} from '@iot-app-kit/core-util';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import type {
  IMessageParser,
  BaseStateManager,
  IMessage,
  AssistantInvocationParams,
  AssistantStartAction,
} from './types';
import { MessageParser } from './messageParser';
import { StateManager } from './stateManager';
import useDataStore from '../../store';
import type {
  ComponentId,
  AssistantActionTarget,
  AssistantActionType,
} from '../../common/assistantProps';
import type { AssistantStateData } from '../../store/assistantSlice';

export interface IUseAssistant {
  assistantClient?: IoTSitewiseAssistantClient;

  /** optional but a default implementation will be provided */
  messageParser?: IMessageParser & MessageParser;
  stateManager?: BaseStateManager & StateManager;

  initialState?: AssistantStateData;
}

const loadingMessage = 'loading...';
const internalMessageParser = new MessageParser();
const internalStateManager = new StateManager(
  () => {},
  () => ({ messages: [], actions: {} }),
  () => {}
);

export const useAssistant = ({
  assistantClient,
  messageParser,
  stateManager,
  initialState,
}: IUseAssistant) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [actions, setActions] = useState<
    Record<
      ComponentId,
      {
        target: AssistantActionTarget;
        action: AssistantActionType;
      }
    >
  >({});
  const [currentStateManager, setStateManager] =
    useState<StateManager>(internalStateManager);
  const [currentMessageParser, setMessageParser] = useState<MessageParser>(
    internalMessageParser
  );
  const storeState = useDataStore.getState();

  useDataStore.subscribe((state, prevState) => {
    const currentActionStateCount = Object.keys(state.actions).length;
    const prevActionStateCount = Object.keys(prevState.actions).length;
    if (currentActionStateCount !== prevActionStateCount) {
      setActions(state.actions);
    }
    const currentMessages = Object.keys(state.messages).length;
    const prevMessagesCount = Object.keys(prevState.messages).length;
    if (currentMessages !== prevMessagesCount) {
      setMessages(state.messages);
    }
  });

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
    clearActions(request.componentId);
  };

  const onError = (
    request: AssistantInvocationRequest,
    error: AssistantClientInvocationError
  ) => {
    currentStateManager.addError(request, error.message ?? '');
    setMessages(currentStateManager.getState().messages);
  };

  if (assistantClient) {
    assistantClient.setRequestHandlers(
      assistantClient.onResponse ? assistantClient.onResponse : onResponse,
      assistantClient.onComplete ? assistantClient.onComplete : onComplete,
      assistantClient.onError ? assistantClient.onError : onError
    );
  }

  const invokeAssistant = ({
    componentId,
    conversationId,
    utterance,
    context,
  }: AssistantInvocationParams) => {
    if (!assistantClient) throw Error('assistantClient is not defined');

    currentStateManager.addText(componentId, utterance, 'user');
    currentStateManager.addPartialResponse(componentId, loadingMessage);
    setMessages(currentStateManager.getState().messages);
    assistantClient.invoke({ componentId, conversationId, utterance, context });
  };

  const generateSummary = ({
    componentId,
    conversationId,
    target,
    utterance,
    context = '',
  }: AssistantInvocationParams) => {
    if (!assistantClient) throw Error('assistantClient is not defined');

    if (utterance) {
      currentStateManager.addText(componentId, utterance, 'user');
      currentStateManager.addPartialResponse(componentId, loadingMessage);
      setMessages(currentStateManager.getState().messages);
    }
    startAction({
      target,
      componentId,
      action: 'summarize',
    });
    assistantClient.generateSummary({
      componentId,
      conversationId,
      context,
      utterance,
    });
  };

  const startAction = (params: AssistantStartAction) => {
    currentStateManager.startComponentAction(params);
    setActions(currentStateManager.getState().actions);
  };

  const clearActions = (componentId: string) => {
    currentStateManager.clearComponentActions(componentId);
    setActions(currentStateManager.getState().actions);
  };

  return {
    actions,
    messages,
    setMessages,
    invokeAssistant,
    generateSummary,
    actionsByComponent: actions,
    startAction,
    clearActions,
  };
};
