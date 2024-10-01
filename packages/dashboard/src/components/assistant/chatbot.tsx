import React, { FC, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import {
  AssistantChatbot,
  useAssistant,
  MessageType,
  useAssistantContext,
  type IMessage,
  SITUATION_SUMMARY_DEFAULT_UTTERANCE,
} from '@iot-app-kit/react-components';
import { useClients } from '../dashboard/clientContext';
import 'animate.css';
import './assistant.css';
import { useDispatch, useSelector } from 'react-redux';
import { onToggleChatbotAction } from '~/store/actions';
import { DashboardState } from '~/store/state';
import { DashboardMessages } from '~/messages';

export interface AssistantChatbotProps {
  height: number;
  messageOverrides: DashboardMessages;
}

export const Chatbot: FC<AssistantChatbotProps> = (
  props: AssistantChatbotProps
) => {
  const dispatch = useDispatch();
  const assistant = useSelector((state: DashboardState) => state.assistant);
  const { iotSiteWisePrivateClient } = useClients();
  const { getContextByComponent } = useAssistantContext();
  const initialMessages: Array<IMessage> = [
    {
      content: props.messageOverrides.assistant.chatbot.initialMessage,
      sender: 'assistant',
      type: MessageType.TEXT,
      id: uuid(),
      loading: false,
    },
  ];

  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: iotSiteWisePrivateClient!,
  });

  const { messages, invokeAssistant, setMessages, generateSummary } =
    useAssistant({
      assistantClient: client,
      initialState: {
        messages: initialMessages,
      },
    });

  useEffect(() => {
    if (assistant.messages && assistant.messages.length > 0) {
      setMessages(assistant.messages);
    }

    if (
      assistant.callerComponentId === 'dashboard' &&
      assistant.action === 'summarize'
    ) {
      const contexts = assistant.selectedQueries
        .map((item) => {
          return getContextByComponent(item.widgetId);
        })
        .join('');

      generateSummary({
        componentId: 'dashboard',
        target: 'dashboard',
        conversationId: assistant.conversationId,
        context: contexts,
        utterance: SITUATION_SUMMARY_DEFAULT_UTTERANCE,
      });
      onToggleChatbotAction({
        open: true,
        callerComponentId: 'dashboard',
        action: undefined,
        messages: assistant.messages ?? [],
      });
    }
  }, [
    assistant.conversationId,
    assistant.messages,
    assistant.callerComponentId,
    assistant.action,
  ]);

  const handleSubmit = (utterance: string) => {
    const componentContext = assistant.callerComponentId
      ? getContextByComponent(assistant.callerComponentId)
      : '';
    invokeAssistant({
      componentId: assistant.callerComponentId ?? 'chatbot',
      conversationId: assistant.conversationId,
      utterance,
      context: componentContext,
      target: 'dashboard',
    });
  };

  const toggleChatbot = (open: boolean) => {
    dispatch(
      onToggleChatbotAction({
        open,
        callerComponentId: '',
        messages: assistant.messages,
      })
    );
  };

  return (
    <AssistantChatbot
      height={props.height}
      messages={messages}
      onSubmit={handleSubmit}
      visible={!!assistant.isChatbotOpen}
      header={{
        headerText:
          props.messageOverrides.assistant.floatingMenu.buttonAIAssistant,
        showResetButton: true,
        showCloseButton: true,
        onReset: () => setMessages(initialMessages),
        onClose: () => toggleChatbot(false),
      }}
    />
  );
};
