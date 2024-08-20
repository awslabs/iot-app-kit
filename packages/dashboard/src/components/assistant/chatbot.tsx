import React, { useState, FC, useEffect } from 'react';
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
import { CHATBOT_DEFAULT_RIGHT } from '~/hooks/useChatbotPosition';

export interface AssistantChatbotProps {
  height: number;
  top: number;
}

export const Chatbot: FC<AssistantChatbotProps> = (
  props: AssistantChatbotProps
) => {
  const [conversationId] = useState<string>(uuid());
  const [isOpen, setOpen] = useState<boolean | null>(null);
  const { iotSiteWisePrivateClient } = useClients();
  const [right, setRight] = useState(CHATBOT_DEFAULT_RIGHT);

  const client = new IoTSitewiseAssistantClient({
    iotSiteWiseClient: iotSiteWisePrivateClient!,
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

  useEffect(() => {
    const dashboardContainer = document.querySelector('.dashboard #container');
    const assistantButton = document.querySelector(
      '.iot-dashboard-assistant-chatbot-button'
    );
    const { left: leftPos = 0 } =
      dashboardContainer?.getBoundingClientRect() ?? {};
    const rightPosition =
      leftPos > 0
        ? leftPos - (assistantButton?.clientWidth ?? 0) + CHATBOT_DEFAULT_RIGHT
        : CHATBOT_DEFAULT_RIGHT;
    setRight(rightPosition);
  }, []);

  const handleSubmit = (utterance: string) => {
    invokeAssistant(conversationId, utterance);
  };

  const chatbotAnimation =
    isOpen === null
      ? 'iot-dashboard-assistant-chatbot-hidden'
      : isOpen
      ? 'animate__fadeInRight'
      : 'animate__fadeOutRight animate__faeOut';

  return (
    <>
      <div
        className='iot-dashboard-assistant-chatbot-button'
        style={{ right: `${right}px`, top: `${props.top}px` }}
      >
        <button onClick={() => setOpen(true)}>
          <img alt='Assistant Icon' src={assistantIcon} width={30} />
        </button>
      </div>
      <div
        className={`iot-dashboard-assistant-chatbot animate__animated ${chatbotAnimation}`}
        style={{ right: `${right}px`, top: `${props.top}px` }}
      >
        <AssistantChatbot
          height={props.height}
          messages={messages}
          onSubmit={handleSubmit}
          visible={!!isOpen}
          onClose={() => setOpen(false)}
        />
      </div>
    </>
  );
};
