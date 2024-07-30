import React, { useState, FC } from 'react';
import { v4 as uuid } from 'uuid';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import {
  AssistantChatbot,
  useAssistant,
  MessageType,
  SenderType,
} from '@iot-app-kit/react-components';
import { useClients } from '../dashboard/clientContext';
import assistantIcon from './assistantIcon.svg';
import 'animate.css';
import './assistant.css';

export interface AssistantChatbotProps {
  assistantId: string;
  height: number;
}

export const Chatbot: FC<AssistantChatbotProps> = (
  props: AssistantChatbotProps
) => {
  const [conversationId] = useState<string>(uuid());
  const [isOpen, setOpen] = useState<boolean | null>(null);
  const { iotSiteWisePrivateClient } = useClients();

  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: iotSiteWisePrivateClient!,
    assistantId: props.assistantId,
  });

  const { messages, invokeAssistant } = useAssistant({
    assistantClient: client,
    initialState: {
      messages: [
        {
          content:
            'Hello, I am your dashboard assistant, please ask me anything about your dashboard.',
          sender: SenderType.ASSISTANT,
          type: MessageType.TEXT,
          id: uuid(),
          loading: false,
        },
      ],
    },
  });

  const handleSubmit = (utterance: string) => {
    invokeAssistant(conversationId, utterance);
  };

  const chatbotAnimation =
    isOpen === null
      ? 'iot-dashboard-assistant-chatbot-hidden'
      : isOpen
      ? 'animate__slideInRight'
      : 'animate__slideOutRight';

  return (
    <>
      <div className='iot-dashboard-assistant-chatbot-button'>
        <button onClick={() => setOpen(true)}>
          <img alt='Assistant Icon' src={assistantIcon} width={30} />
        </button>
      </div>
      <div
        className={`iot-dashboard-assistant-chatbot animate__animated ${chatbotAnimation}`}
      >
        <AssistantChatbot
          height={props.height}
          messages={messages}
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
      </div>
    </>
  );
};
