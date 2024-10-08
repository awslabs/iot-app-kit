import { useEffect, useState } from 'react';
import type {
  AssistantClientInvocationError,
  AssistantClientInvocationResponse,
  AssistantInvocationRequest,
} from '@iot-app-kit/core-util';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import type {
  IMessageParser,
  IMessage,
  AssistantInvocationParams,
  AssistantStartAction,
  AssistantAction,
} from './types';
import { MessageParser } from './messageParser';
import useDataStore from '../../store';
import { ComponentId } from '../../common/assistantProps';

export interface IUseAssistant {
  assistantClient?: IoTSitewiseAssistantClient;

  /** optional but a default implementation will be provided */
  messageParser?: IMessageParser & MessageParser;
}

const loadingMessage = 'loading...';
const internalMessageParser = new MessageParser();

export const useAssistant = ({
  assistantClient,
  messageParser,
}: IUseAssistant) => {
  const messages = useDataStore((state) => state.messages);
  const actions = useDataStore((state) => state.actions);
  const setMessages = (messages: IMessage[]) =>
    useDataStore.setState({ messages: [...messages] });
  const setActions = (actions: Record<ComponentId, AssistantAction>) =>
    useDataStore.setState({ actions });

  const [currentMessageParser, setMessageParser] = useState<MessageParser>(
    internalMessageParser
  );

  useEffect(() => {
    let newMessageParser = currentMessageParser;

    if (messageParser) {
      newMessageParser = messageParser;
    }

    setMessageParser(newMessageParser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeLoadingMessages = (componentId: string) => {
    const indexesToDelete: number[] = [];
    const currentMessages = [...useDataStore.getState().messages];
    currentMessages.forEach((message: IMessage, index: number) => {
      if (message.loading && message.originComponentId === componentId) {
        indexesToDelete.push(index);
      }
    });

    indexesToDelete
      .slice()
      .reverse()
      .forEach((index: number) => {
        currentMessages.splice(index, 1);
      });

    return currentMessages;
  };

  const onResponse = (
    request: AssistantInvocationRequest,
    response: AssistantClientInvocationResponse
  ) => {
    const currentMessages = removeLoadingMessages(request.componentId);
    const newMessages = currentMessageParser.parse(request, response.body);
    setMessages([...currentMessages, ...newMessages]);
  };

  const onComplete = (
    request: AssistantInvocationRequest,
    response: AssistantClientInvocationResponse
  ) => {
    const currentMessages = removeLoadingMessages(request.componentId);
    const newMessages = currentMessageParser.parse(request, response.body);
    setMessages([...currentMessages, ...newMessages]);
    clearActions(request.componentId);
  };

  const onError = (
    request: AssistantInvocationRequest,
    error: AssistantClientInvocationError
  ) => {
    const message = currentMessageParser.getError(request, error.message ?? '');
    setMessages([...useDataStore.getState().messages, message]);
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
    const userMessage = currentMessageParser.getText(
      componentId,
      utterance,
      'user'
    );
    const partialMessage = currentMessageParser.getPartialResponse(
      componentId,
      loadingMessage
    );
    setMessages([
      ...useDataStore.getState().messages,
      userMessage,
      partialMessage,
    ]);
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
      const userMessage = currentMessageParser.getText(
        componentId,
        utterance,
        'user'
      );
      const partialMessage = currentMessageParser.getPartialResponse(
        componentId,
        loadingMessage
      );
      setMessages([
        ...useDataStore.getState().messages,
        userMessage,
        partialMessage,
      ]);
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
    const { componentId, target, action } = params;
    setActions({
      ...useDataStore.getState().actions,
      [componentId]: {
        target,
        action,
      },
    });
  };

  const clearActions = (componentId: string) => {
    const { actions } = useDataStore.getState();
    if (actions[componentId]) {
      delete actions[componentId];
    }
    setActions(actions);
  };

  const clearAll = () => {
    setActions({});
    setMessages([]);
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
    clearAll,
  };
};
