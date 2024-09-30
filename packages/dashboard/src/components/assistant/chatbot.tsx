import React, { FC, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import {
  AssistantChatbot,
  useAssistant,
  MessageType,
  useAssistantContext,
  type IMessage,
} from '@iot-app-kit/react-components';
import { useClients } from '../dashboard/clientContext';
import 'animate.css';
import './assistant.css';
import { useDispatch, useSelector } from 'react-redux';
import { onToggleChatbotAction } from '~/store/actions';
import { DashboardState } from '~/store/state';

export interface AssistantChatbotProps {
  height: number;
}

const initialMessages: Array<IMessage> = [
  {
    content:
      'Hello, I am your dashboard assistant, please ask me anything about your dashboard.',
    sender: 'assistant',
    type: MessageType.TEXT,
    id: uuid(),
    loading: false,
  },
];

export const Chatbot: FC<AssistantChatbotProps> = (
  props: AssistantChatbotProps
) => {
  const dispatch = useDispatch();
  const assistant = useSelector((state: DashboardState) => state.assistant);
  const { iotSiteWisePrivateClient } = useClients();
  const { getContextByComponent } = useAssistantContext();

  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: iotSiteWisePrivateClient!,
  });

  const { messages, invokeAssistant, setMessages } = useAssistant({
    assistantClient: client,
    initialState: {
      messages: initialMessages,
    },
  });

  useEffect(() => {
    if (assistant.messages && assistant.messages.length > 0) {
      setMessages(assistant.messages);
    }
  }, [assistant.messages, assistant.componentId]);

  const handleSubmit = (utterance: string) => {
    const componentContext = assistant.componentId
      ? getContextByComponent(assistant.componentId)
      : '';
    invokeAssistant({
      componentId: 'chatbot',
      conversationId: assistant.conversationId,
      utterance,
      context: componentContext,
    });
  };

  const toggleChatbot = (open: boolean) => {
    dispatch(
      onToggleChatbotAction({
        open,
        componentId: '',
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
        headerText: 'AI Assistant',
        showResetButton: true,
        showCloseButton: true,
        onReset: () => setMessages(initialMessages),
        onClose: () => toggleChatbot(false),
      }}
    />
  );
};
