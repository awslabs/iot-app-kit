import React, { FC, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import {
  AssistantChatbot,
  useAssistant,
  MessageType,
  useAssistantContext,
} from '@iot-app-kit/react-components';
import { useClients } from '../dashboard/clientContext';
import assistantIcon from './assistantIcon.svg';
import 'animate.css';
import './assistant.css';
import { useDispatch, useSelector } from 'react-redux';
import { onToggleChatbotAction } from '~/store/actions';
import { DashboardState } from '~/store/state';

export interface AssistantChatbotProps {
  height: number;
  top: number;
}

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
      messages: [
        {
          content:
            'Hello, I am your dashboard assistant, please ask me anything about your dashboard.',
          sender: 'assistant',
          type: MessageType.TEXT,
          id: uuid(),
          loading: false,
        },
      ],
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
    invokeAssistant(assistant.conversationID, utterance, componentContext);
  };

  const chatbotAnimation =
    assistant.isChatbotOpen === null
      ? 'iot-dashboard-assistant-chatbot-hidden'
      : assistant.isChatbotOpen
      ? 'animate__fadeInRight'
      : 'animate__fadeOutRight animate__faeOut';

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
    <>
      <div
        className='iot-dashboard-assistant-chatbot-button'
        style={{ top: `${props.top}px` }}
      >
        <button onClick={() => toggleChatbot(true)}>
          <img alt='Assistant Icon' src={assistantIcon} width={30} />
        </button>
      </div>
      <div
        className={`iot-dashboard-assistant-chatbot animate__animated ${chatbotAnimation}`}
        style={{ top: `${props.top}px` }}
      >
        <AssistantChatbot
          height={props.height}
          messages={messages}
          onSubmit={handleSubmit}
          visible={!!assistant.isChatbotOpen}
          onClose={() => toggleChatbot(false)}
        />
      </div>
    </>
  );
};
